"use strict";
const Plugin_1 = require("../Plugin");
class lang {
    constructor(local, name) {
        this.local = local;
        this.name = name || undefined;
        this.data = {};
    }
    t(key, param) {
        this.data[key] = (param === null || param === void 0 ? void 0 : param.toString()) || '';
    }
}
module.exports = class I18n extends Plugin_1.ActivePlugin {
    constructor(ctx) {
        super('i18n', ctx);
        this.langs = {};
        this.customLangs = {};
    }
    generateLang(data) {
        let result = '';
        for (const key in data)
            if(typeof data[key] != "function") result += `${key}=${data[key]}\n`;
        return result;
    }
    new(local, isCustom = false, customName) {
        if (isCustom && !this.customLangs[local])
            this.customLangs[local] = new lang(local, customName);
        if (!this.langs[local])
            this.langs[local] = new lang(local);
        return isCustom ? this.customLangs[local] : this.langs[local];
    }
    listAll() {
        return Object.keys(this.langs);
    }
    listAllCustom() {
        return Object.keys(this.customLangs);
    }
    onGenerate() {
        console.log('Generating i18n files...');
        for (const _lang in this.langs)
            if( this.langs[_lang].data )
                this.write(`resources/texts/${_lang}.lang`, this.generateLang(this.langs[_lang].data));
        for (const _cstLang in this.customLangs)
            if( this.customLangs[_cstLang].data )
                this.write(`resources/texts/${_cstLang}.lang`, this.generateLang(this.customLangs[_cstLang].data));
        this.write('resources/texts/languages.json', JSON.stringify(this.listAllCustom()));
        this.write('resources/texts/language_names.json', JSON.stringify(this.listAllCustom().map(l => [l, this.customLangs[l].name || l])));
    }
};
