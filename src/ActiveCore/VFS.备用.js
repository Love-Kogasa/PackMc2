var path = require("path");

module.exports = {
  _vDir: {},
  virtual: true,

  // 规范化路径（处理跨平台差异）
  _normalizePath(p) {
    return path.normalize(p).replace(/\\/g, '/');
  },

  existsSync(p) {
    const path = this._normalizePath(p);
    return this._vDir[path] !== undefined;
  },

  readFileSync(p, options) {
    const path = this._normalizePath(p);
    const entry = this._vDir[path];
    
    if (entry === undefined) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    if (entry.isDirectory) {
      throw Object.assign(new Error("EISDIR: illegal operation on a directory"), {
        code: 'EISDIR',
        errno: -4068,
        path
      });
    }
    
    // 支持二进制/文本返回
    const encoding = typeof options === 'string' ? options : (options || {}).encoding;
    return encoding ? entry.content.toString(encoding) : Buffer.from(entry.content);
  },

  writeFileSync(p, data, options) {
    const path = this._normalizePath(p);
    const parent = this._normalizePath(path.dirname(path));
    
    // 验证父目录存在
    if (!this.existsSync(parent) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    // 处理二进制数据
    const content = Buffer.isBuffer(data) ? data : 
                   typeof data === 'string' ? Buffer.from(data) : 
                   Buffer.from(String(data));
    
    this._vDir[path] = {
      content,
      isDirectory: false,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  },

  mkdirSync(p, options) {
    const path = this._normalizePath(p);
    const recursive = options && options.recursive;
    
    if (this.existsSync(path)) {
      if (!recursive) {
        throw Object.assign(new Error("EEXIST: file already exists"), {
          code: 'EEXIST',
          errno: -17,
          path
        });
      }
      return;
    }
    
    const parent = this._normalizePath(path.dirname(path));
    
    // 递归创建父目录
    if (!this.existsSync(parent) && parent !== path) {
      if (recursive) {
        this.mkdirSync(parent, { recursive: true });
      } else {
        throw Object.assign(new Error("ENOENT: no such file or directory"), {
          code: 'ENOENT',
          errno: -2,
          path
        });
      }
    }
    
    this._vDir[path] = {
      isDirectory: true,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  },

  appendFileSync(p, data) {
    const path = this._normalizePath(p);
    
    if (!this.existsSync(path)) {
      this.writeFileSync(path, data);
      return;
    }
    
    const entry = this._vDir[path];
    if (entry.isDirectory) {
      throw Object.assign(new Error("EISDIR: illegal operation on a directory"), {
        code: 'EISDIR',
        errno: -4068,
        path
      });
    }
    
    const newData = Buffer.isBuffer(data) ? data : Buffer.from(String(data));
    entry.content = Buffer.concat([entry.content, newData]);
    entry.modifiedAt = Date.now();
  },

  readdirSync(p) {
    const path = this._normalizePath(p);
    const entry = this._vDir[path];
    
    if (entry === undefined) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    if (!entry.isDirectory) {
      throw Object.assign(new Error("ENOTDIR: not a directory"), {
        code: 'ENOTDIR',
        errno: -4052,
        path
      });
    }
    
    const dirPath = path.endsWith('/') ? path : path + '/';
    const children = new Set();
    
    Object.keys(this._vDir).forEach(filePath => {
      if (filePath.startsWith(dirPath)) {
        const relPath = filePath.slice(dirPath.length);
        const parts = relPath.split('/');
        if (parts.length > 0 && parts[0]) {
          children.add(parts[0]);
        }
      }
    });
    
    return Array.from(children);
  },

  statSync(p) {
    const path = this._normalizePath(p);
    const entry = this._vDir[path];
    
    if (entry === undefined) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    return {
      isFile: () => !entry.isDirectory,
      isDirectory: () => entry.isDirectory,
      size: entry.isDirectory ? 0 : entry.content.length,
      birthtime: new Date(entry.createdAt),
      mtime: new Date(entry.modifiedAt)
    };
  },

  unlinkSync(p) {
    const path = this._normalizePath(p);
    const entry = this._vDir[path];
    
    if (entry === undefined) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    if (entry.isDirectory) {
      throw Object.assign(new Error("EISDIR: illegal operation on a directory"), {
        code: 'EISDIR',
        errno: -4068,
        path
      });
    }
    
    delete this._vDir[path];
  },

  rmdirSync(p) {
    const path = this._normalizePath(p);
    const entry = this._vDir[path];
    
    if (entry === undefined) {
      throw Object.assign(new Error("ENOENT: no such file or directory"), {
        code: 'ENOENT',
        errno: -2,
        path
      });
    }
    
    if (!entry.isDirectory) {
      throw Object.assign(new Error("ENOTDIR: not a directory"), {
        code: 'ENOTDIR',
        errno: -4052,
        path
      });
    }
    
    // 检查目录是否为空
    if (this.readdirSync(path).length > 0) {
      throw Object.assign(new Error("ENOTEMPTY: directory not empty"), {
        code: 'ENOTEMPTY',
        errno: -4051,
        path
      });
    }
    
    delete this._vDir[path];
  },

  bindFileSystem(fsObject) {
    Object.keys(fsObject).forEach(p => {
      const normalized = this._normalizePath(p);
      const entry = fsObject[p];
      
      if (typeof entry === 'string' || Buffer.isBuffer(entry)) {
        this._vDir[normalized] = {
          content: Buffer.isBuffer(entry) ? entry : Buffer.from(entry),
          isDirectory: false,
          createdAt: Date.now(),
          modifiedAt: Date.now()
        };
      } else if (entry && entry.isDirectory) {
        this._vDir[normalized] = {
          isDirectory: true,
          createdAt: Date.now(),
          modifiedAt: Date.now()
        };
      }
    });
    return this;
  }
};