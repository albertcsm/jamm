angular.module('jamm.repository', [])
.service('MovieService', function () {
    this.movies = [
        { 
            id: 'IP_MAN-3',
            name: '葉問3：師徒情',
            actors: [ '甄子丹', '熊黛林', '張晉', '譚耀文' ],
            releaseDate: '2015-12-24',
            rating: 3,
            tags: [ 'Action', 'Martial arts' ],
            storage: {
                repository: 'wd2b',
                path: 'download/ipman3-hd1080',
                cover: 'media/cover.jpg',
                images: [
                    { file: 'media/gallery1.jpg' },
                    { file: 'media/gallery2.jpg' }
                ],
                quality: 'HD'
            }
        },
        { 
            id: 'HUNGER_GAME-3_1',
            name: 'The Hunger Games: Mockingjay – Part 1',
            actors: [ 'Jennifer Lawrence', 'Josh Hutcherson', 'Liam Hemsworth' ],
            releaseDate: '2014-11-10',
            rating: 2,
            tags: [ 'Adventure', 'Sci-Fi' ],
            storage: {
                repository: 'home',
                path: 'Downloads/bt/The Hunger Games Mockingjay Part 1 (2014) HDRip XviD-MAXSPEED',
                cover: 'media/cover.jpg',
                images: [
                    { file: 'media/gallery1.jpg' },
                    { file: 'media/gallery2.jpg' }
                ],
                quality: 'HD'
            }
        },
        { 
            id: 'ANT_MAN',
            name: 'Ant-Man',
            actors: [ 'Paul Rudd', 'Michael Douglas', 'Corey Stoll' ],
            releaseDate: '2015-06-29',
            rating: 3,
            tags: [ 'Action' ],
            storage: {
                repository: 'home',
                path: 'Downloads/bt/Ant-Man 2015 1080p BluRay x264 DTS-JYK',
                cover: 'media/cover.jpg',
                images: [
                    { file: 'media/gallery1.jpg' },
                    { file: 'media/gallery2.jpg' }
                ],
                quality: 'HD'
            }
        },
        { 
            id: 'EX_MACHINA',
            name: 'Ex Machina',
            actors: [ 'Alicia Vikander', 'Domhnall Gleeson', 'Oscar Isaac' ],
            releaseDate: '2015-01-21',
            rating: 3,
            tags: [ ],
            storage: {
                repository: 'wd2b',
                path: 'Downloads/bt/EX Machina ENG (2015) [1080p] - NEGATiVE',
                cover: 'media/cover.jpg',
                images: [
                    { file: 'media/gallery1.jpg' },
                    { file: 'media/gallery2.jpg' }
                ],
                quality: 'HD'
            }
        },
        { 
            id: 'INTERSTELLAR',
            name: 'Interstellar',
            actors: [ 'Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain' ],
            releaseDate: '2014-11-06',
            rating: 3,
            tags: [ 'Mars' ],
            storage: {
                repository: 'wd2b',
                path: 'Downloads/bt/Interstellar (2014) (2014) [1080p]',
                cover: 'media/cover.jpg',
                images: [
                    { file: 'media/gallery1.jpg' },
                    { file: 'media/gallery2.jpg' }
                ],
                quality: 'HD'
            }
        }
    ];
});