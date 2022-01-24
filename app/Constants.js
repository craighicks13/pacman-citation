System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Constants, Direction, Category;
    return {
        setters:[],
        execute: function() {
            Constants = (function () {
                function Constants() {
                }
                Constants.LOAD_COMPLETE = "LOAD COMPLETED";
                Constants.MAZE_LOADED = "MAZE LOADED";
                Constants.PART_COLLECTED = "PART COLLECTED";
                Constants.ALL_PARTS_COLLECTED = "ALL PARTS COLLECTED";
                Constants.CORRECT = "CORRECT";
                Constants.INCORRECT = "INCORRECT";
                Constants.INSTRUCTIONS = "INSTRUCTIONS";
                Constants.INST_MSG_DESKTOP = "Use pacman to gobble the citation snippets in the correct order according to the type of source indicated in the centre. Use the arrow keys to move pacman around the maze or click the snippet you'd like pacman to eat next.";
                Constants.INST_MSG_TOUCH = "Use pacman to gobble the citation snippets in the correct order according to the type of source indicated in the centre. Swipe the direction you want pacman to move to guide him around the maze or click the snippet you'd like pacman to eat next.";
                Constants.RESET = "RESET";
                Constants.CLOSE_WINDOW = "CLOSE WINDOW";
                Constants.AUTO_RUN = "AUTO RUN";
                Constants.MAP_BORDER = 15;
                Constants.MAP_GAP = 40;
                Constants.MAZE_MAP = [
                    '0000010010000100100000',
                    '0111010110110110101110',
                    '0000000000000000000000',
                    '0101101011111101011010',
                    '0001101011111101011000',
                    '1101101011111101011011',
                    '0100000011111100000010',
                    '0101111011111101111010',
                    '0000110001111000110000',
                    '0110000100110010000110',
                    '0110101110000111010110',
                    '0000000100110010000000',
                    '0111110001111000111110'
                ];
                Constants.CATEGORY_LIST = {
                    category: [{
                            title: 'website-title',
                            correct: "Amato, M. (n.d.). Beer tasting 101. Retrieved from http://beerology.ca/how-to-taste-beer/",
                            colours: [{ RED: 0, GREEN: 240, BLUE: 255 }, { RED: 2, GREEN: 237, BLUE: 173 }],
                            parts: [
                                { name: 'assets/website-amato', row: 4, col: 1, rotation: 270 },
                                { name: 'assets/website-nd', row: 12, col: 2 },
                                { name: 'assets/website-beertasting', row: 7, col: 3.6 },
                                { name: 'assets/website-retrieved', row: 12, col: 17 },
                                { name: 'assets/website-link', row: 3, col: 15 }
                            ] },
                        {
                            title: 'book-title',
                            correct: "Alworth, J. (2012). Beer tasting quick reference. San Francisco, CA: Chronicle Books LLC.",
                            colours: [{ RED: 109, GREEN: 184, BLUE: 3 }, { RED: 255, GREEN: 252, BLUE: 14 }],
                            parts: [
                                { name: 'assets/book-alworth', row: 13, col: 6.8 },
                                { name: 'assets/book-year', row: 1, col: 18.75 },
                                { name: 'assets/book-beertasting', row: 13, col: 1, rotation: 270 },
                                { name: 'assets/book-sanfran', row: 1, col: 1 },
                                { name: 'assets/book-chronicle', row: 7, col: 15.75 }
                            ] },
                        {
                            title: 'newspaper-title',
                            correct: "Mahoney, J. (2007, January 13). Let\u2019s be clear about beer. The Spectator, p. 4. Retrieved from\n                http://search.proquest.com.libezproxy.nait.ca/docview/270263640?",
                            colours: [{ RED: 255, GREEN: 0, BLUE: 108 }, { RED: 193, GREEN: 3, BLUE: 215 }],
                            parts: [
                                { name: 'assets/news-mahoney', row: 9, col: 1 },
                                { name: 'assets/news-year', row: 1, col: 22, rotation: 90 },
                                { name: 'assets/news-lets', row: 12, col: 1.6 },
                                { name: 'assets/news-spectator', row: 7, col: 15.5 },
                                { name: 'assets/news-p4', row: 1, col: 10.6 },
                                { name: 'assets/news-retrieved', row: 12, col: 17.5 },
                                { name: 'assets/news-link', row: 3, col: 1 }
                            ] },
                        {
                            title: 'journal-title',
                            correct: "Sierksma, A., & Kok, F.J. (2012). Beer and health: From myths to science. European Journal of Clinical\n                Nutrition, 66(7), 869-870. Retrieved from\n                http://libezproxy.nait.ca/login?url=77495798&site",
                            colours: [{ RED: 84, GREEN: 3, BLUE: 217 }, { RED: 189, GREEN: 15, BLUE: 254 }],
                            parts: [
                                { name: 'assets/journal-sierksma', row: 12, col: 1.5 },
                                { name: 'assets/journal-year', row: 13, col: 13.8 },
                                { name: 'assets/journal-beerandhealth', row: 3, col: 1.5 },
                                { name: 'assets/journal-european', row: 7, col: 22, rotation: 90 },
                                { name: 'assets/journal-refnum', row: 7, col: 15.8 },
                                { name: 'assets/journal-retrieved', row: 7, col: 3.5 },
                                { name: 'assets/journal-link', row: 3, col: 12 }
                            ] },
                    ] };
                return Constants;
            }());
            exports_1("Constants", Constants);
            (function (Direction) {
                Direction[Direction["NONE"] = 0] = "NONE";
                Direction[Direction["UP"] = 1] = "UP";
                Direction[Direction["DOWN"] = 2] = "DOWN";
                Direction[Direction["LEFT"] = 3] = "LEFT";
                Direction[Direction["RIGHT"] = 4] = "RIGHT";
            })(Direction || (Direction = {}));
            exports_1("Direction", Direction);
            (function (Category) {
                Category[Category["WEBSITE"] = 0] = "WEBSITE";
                Category[Category["BOOK"] = 1] = "BOOK";
                Category[Category["NEWSPAPER"] = 2] = "NEWSPAPER";
                Category[Category["JOURNAL"] = 3] = "JOURNAL";
            })(Category || (Category = {}));
            exports_1("Category", Category);
        }
    }
});
//# sourceMappingURL=Constants.js.map