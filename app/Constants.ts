
export class Constants {
    public static LOAD_COMPLETE: string = "LOAD COMPLETED";
    public static MAZE_LOADED: string = "MAZE LOADED";
    public static PART_COLLECTED: string = "PART COLLECTED";
    public static ALL_PARTS_COLLECTED: string = "ALL PARTS COLLECTED";
    public static CORRECT: string = "CORRECT";
    public static INCORRECT: string = "INCORRECT";
    public static INSTRUCTIONS: string = "INSTRUCTIONS";
    public static INST_MSG_DESKTOP: string = `Use pacman to gobble the citation snippets in the correct order according to the type of source indicated in the centre. Use the arrow keys to move pacman around the maze or click the snippet you'd like pacman to eat next.`
    public static INST_MSG_TOUCH: string = `Use pacman to gobble the citation snippets in the correct order according to the type of source indicated in the centre. Swipe the direction you want pacman to move to guide him around the maze or click the snippet you'd like pacman to eat next.`
    public static RESET: string = "RESET";
    public static CLOSE_WINDOW: string = "CLOSE WINDOW";
    public static AUTO_RUN: string = "AUTO RUN";
    public static MAP_BORDER: number = 15;
    public static MAP_GAP: number = 40;

    public static MAZE_MAP = [
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

    public static CATEGORY_LIST = {
        category: [{
            title: 'website-title',
            correct: `Amato, M. (n.d.). Beer tasting 101. Retrieved from http://beerology.ca/how-to-taste-beer/`,
            colours: [{RED:0, GREEN:240, BLUE:255}, {RED:2, GREEN:237, BLUE:173}],
            parts: [
                {name: 'assets/website-amato', row: 4, col: 1, rotation: 270},
                {name: 'assets/website-nd', row: 12, col: 2},
                {name: 'assets/website-beertasting', row: 7, col: 3.6},
                {name: 'assets/website-retrieved', row: 12, col: 17},
                {name: 'assets/website-link', row: 3, col: 15}
            ]},
            {
            title: 'book-title',
            correct: `Alworth, J. (2012). Beer tasting quick reference. San Francisco, CA: Chronicle Books LLC.`,
            colours: [{RED:109, GREEN:184, BLUE:3}, {RED:255, GREEN:252, BLUE:14}],
            parts: [
                 {name: 'assets/book-alworth', row: 13, col: 6.8},
                 {name: 'assets/book-year', row: 1, col: 18.75},
                 {name: 'assets/book-beertasting', row: 13, col: 1, rotation: 270},
                 {name: 'assets/book-sanfran', row: 1, col: 1},
                 {name: 'assets/book-chronicle', row: 7, col: 15.75}
            ]},
            {
            title: 'newspaper-title',
            correct: `Mahoney, J. (2007, January 13). Let’s be clear about beer. The Spectator, p. 4. Retrieved from
                http://search.proquest.com.libezproxy.nait.ca/docview/270263640?`,
            colours: [{RED:255, GREEN: 0, BLUE:108}, {RED:193, GREEN: 3, BLUE:215}],
            parts: [
                 {name: 'assets/news-mahoney', row: 9, col: 1},
                 {name: 'assets/news-year', row: 1, col: 22, rotation: 90},
                 {name: 'assets/news-lets', row: 12, col: 1.6},
                 {name: 'assets/news-spectator', row: 7, col: 15.5},
                 {name: 'assets/news-p4', row: 1, col: 10.6},
                 {name: 'assets/news-retrieved', row: 12, col: 17.5},
                 {name: 'assets/news-link', row: 3, col: 1}
            ]},
            {
            title: 'journal-title',
            correct: `Sierksma, A., & Kok, F.J. (2012). Beer and health: From myths to science. European Journal of Clinical
                Nutrition, 66(7), 869-870. Retrieved from
                http://libezproxy.nait.ca/login?url=77495798&site`,
            colours: [{RED:84, GREEN:3, BLUE:217}, {RED:189, GREEN:15, BLUE:254}],
            parts: [
                 {name: 'assets/journal-sierksma', row: 12, col: 1.5},
                 {name: 'assets/journal-year', row: 13, col: 13.8},
                 {name: 'assets/journal-beerandhealth', row: 3, col: 1.5},
                 {name: 'assets/journal-european', row: 7, col: 22, rotation: 90},
                 {name: 'assets/journal-refnum', row: 7, col: 15.8},
                 {name: 'assets/journal-retrieved', row: 7, col: 3.5},
                 {name: 'assets/journal-link', row: 3, col: 12}
            ]},
        ]};
   
}

export enum Direction {
    NONE = 0,
    UP = 1, 
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

export enum Category {
    WEBSITE = 0,
    BOOK, 
    NEWSPAPER, 
    JOURNAL
}
