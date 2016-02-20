angular.module('jamm')
.service('MovieService', function () {
    this.movies = [
        { 
            id: 'IP_MAN-3',
            title: '葉問3：師徒情',
            actors: [ '甄子丹', '熊黛林', '張晉', '譚耀文' ],
            releaseDates: '2015-12-24',
            rating: 3,
            tags: [ 'Action', 'Martial arts' ],
            storage: {
                repository: 'wd2b',
                path: 'download/ipman3-hd1080',
                quality: 'HD'
            }
        },
        { 
            id: 'HUNGER_GAME-3_1',
            title: 'The Hunger Games: Mockingjay – Part 1',
            actors: [ 'Jennifer Lawrence', 'Josh Hutcherson', 'Liam Hemsworth' ],
            releaseDates: '2014-11-10',
            rating: 2,
            tags: [ 'Adventure', 'Sci-Fi' ],
            storage: {
                repository: 'home',
                path: 'Downloads/bt/The Hunger Games Mockingjay Part 1 (2014) HDRip XviD-MAXSPEED',
                quality: 'HD'
            }
        },
        { 
            id: 'ANT_MAN',
            title: 'Ant-Man',
            actors: [ 'Paul Rudd', 'Michael Douglas', 'Corey Stoll' ],
            releaseDates: '2015-06-29',
            rating: 3,
            tags: [ 'Action' ],
            storage: {
                repository: 'home',
                path: 'Downloads/bt/Ant-Man 2015 1080p BluRay x264 DTS-JYK',
                quality: 'HD'
            }
        },
        { 
            id: 'EX_MACHINA',
            title: 'Ex Machina',
            actors: [ 'Alicia Vikander', 'Domhnall Gleeson', 'Oscar Isaac' ],
            releaseDates: '2015-01-21',
            rating: 3,
            tags: [ ],
            storage: {
                repository: 'wd2b',
                path: 'Downloads/bt/EX Machina ENG (2015) [1080p] - NEGATiVE',
                quality: 'HD'
            }
        },
        { 
            id: 'INTERSTELLAR',
            title: 'Interstellar',
            actors: [ 'Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain' ],
            releaseDates: '2014-11-06',
            rating: 3,
            tags: [ 'Mars' ],
            storage: {
                repository: 'wd2b',
                path: 'Downloads/bt/Interstellar (2014) (2014) [1080p]',
                quality: 'HD'
            }
        }
    ];
});