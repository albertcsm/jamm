var _ = require('lodash');

var movies = [
    { 
        id: 'IP_MAN-3',
        name: '葉問3：師徒情',
        actors: [ 
            { name: '甄子丹' }, 
            { name: '熊黛林' },
            { name: '張晉' },
            { name: '譚耀文' }
        ],
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
            videos: [
                { 
                    file: 'media/video1.mp4',
                    resolution: '720x480',
                    length: '05:10',
                    size: 33387486
                },
                {
                    file: 'media/video2.mkv',
                    resolution: '1280x688',
                    length: '2:06:35',
                    size: 1626060492
                }
            ],
            quality: 'HD'
        }
    },
    { 
        id: 'HUNGER_GAME-3_1',
        name: 'The Hunger Games: Mockingjay – Part 1',
        actors: [ 
            { name: 'Jennifer Lawrence' },
            { name: 'Josh Hutcherson' },
            { name: 'Liam Hemsworth' }
        ],
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
            videos: [
                { 
                    file: 'media/video1.mp4',
                    resolution: '720x480',
                    length: '05:10',
                    size: 33387486
                },
                {
                    file: 'media/video2.mkv',
                    resolution: '1280x688',
                    length: '2:06:35',
                    size: 1626060492
                }
            ],
            quality: 'HD'
        }
    },
    { 
        id: 'ANT_MAN',
        name: 'Ant-Man',
        actors: [
            { name: 'Paul Rudd' },
            { name: 'Michael Douglas' },
            { name: 'Corey Stoll' }
        ],
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
            videos: [
                { 
                    file: 'media/video1.mp4',
                    resolution: '720x480',
                    length: '05:10',
                    size: 33387486
                },
                {
                    file: 'media/video2.mkv',
                    resolution: '1280x688',
                    length: '2:06:35',
                    size: 1626060492
                }
            ],
            quality: 'HD'
        }
    },
    { 
        id: 'EX_MACHINA',
        name: 'Ex Machina',
        actors: [
            { name: 'Alicia Vikander' },
            { name: 'Domhnall Gleeson' },
            { name: 'Oscar Isaac' }
        ],
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
            videos: [
                { 
                    file: 'media/video1.mp4',
                    resolution: '720x480',
                    length: '05:10',
                    size: 33387486
                },
                {
                    file: 'media/video2.mkv',
                    resolution: '1280x688',
                    length: '2:06:35',
                    size: 1626060492
                }
            ],
            quality: 'HD'
        }
    },
    { 
        id: 'INTERSTELLAR',
        name: 'Interstellar',
        actors: [
            { name: 'Matthew McConaughey' },
            { name: 'Anne Hathaway' },
            { name: 'Jessica Chastain' }
        ],
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
            videos: [
                { 
                    file: 'media/video1.mp4',
                    resolution: '720x480',
                    length: '05:10',
                    size: 33387486
                },
                {
                    file: 'media/video2.mkv',
                    resolution: '1280x688',
                    length: '2:06:35',
                    size: 1626060492
                }
            ],
            quality: 'HD'
        }
    }
];

exports.create = function (movie, callback) {
    movies.push(movie);
    callback(movie);
};

exports.all = function (callback) {
    callback(movies);
};

exports.get = function (id, callback) {
    var movie = _.find(movies, { id: id });
    callback(movie);
};

exports.update = function (id, movie, callback) {
    var index = _.findIndex(movies, { id: id });
    if (index > -1) {
        movies.splice(index, 1, movie);
        callback(movie);
    } else {
        callback(false);
    }
};

exports.delete = function (id, callback) {
    var index = _.findIndex(movies, { id: id });
    if (index > -1) {
        movies.splice(index, 1);
        callback({ deleted: 1 });
    } else {
        callback({ deleted: 0 });
    }
};
