export default class Normalize {

    /**
     * Return a new version of the string passed in argument without letters with accents
     * @param {String} string
     */
    static string(string) {
        return string.normalize("NFD").replace(/[\u0300-\u036f]/ig, "");
    }
}