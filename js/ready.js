var kyle = {
    "name": "Kyle Thompson",
    "flickr_id": '71301902@N04'
}
var tyler = {
    "name": "Tyler Hayes",
    "flickr_id": '93031553@N05'
}
var john = {
    "name": "John Stavas",
    "flickr_id": '95249750@N05'
}
var mikey = {
    "name": "Mikey $harks",
    "flickr_id": '129710171@N04'
}

//Global options
var artist = kyle; //the artist
var should_photos_shuffle = false; //if false, the order is determined by the API response.
var photo_insertion_duration = 600; //the time it takes for each photo to fade and compact into the gallery.
var photo_insertion_duration_mobile = 300; //the time it takes for each photo to fade and compact into the gallery on mobile.

$(document).ready(function() {
    createTroubleshootMessage();
    addName();
    createPhotoGallery();
});

var createTroubleshootMessage = function() {
    setTimeout(function(){$("#troubleshoot_message").css('visibility', 'visible')}, 6000);
}

var addName = function() {
    var artists_name_selector = '#artists_name';
    var container = $(artists_name_selector); 
    container.append(artist.name);
}

var createPhotoGallery = function(callback) {
    var key = '4fdc983965119bdf7a0832b9e93ec19f';
    var user_id = artist.flickr_id;
    var extras = 'url_c';
    var url = 'https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=' + key + '&user_id=' + user_id + '&extras=' + extras + '&per_page=100&page=1&format=json&nojsoncallback=1'
    $.getJSON(url, function(data) {
        var photos = []; 
        var photo_objs = data.photos.photo
        $.each(photo_objs, function(key, photo_obj) {
            var photo = '<img src="' + buildPhotoURL(photo_obj) + '" alt=""/>'; //no alt tag so doesnt show while loading
            photos.push(photo);
        });
        if (should_photos_shuffle) { shuffle(photos); }
        var imgs_html = photos.join("");
        var photo_gallery_selector = '#photo_container';
        var gallery = $(photo_gallery_selector);
        gallery.append(imgs_html);
        display(gallery);
    });
}

var buildPhotoURL = function(photo) {
    var size = generateSize(); 
    var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + size + '.jpg'
    return url;
}

var generateSize = function() {
    /*sizes specified in https://www.flickr.com/services/api/misc.urls.html
    ************************************************************************/
    var window_width = $(window).width();
    //make quasi-random size
    var random = Math.random()

    if (window_width > 1200) {
        if (random < .3) { size = '' } //30% 500px
        else if (random < .6) { size = '_z' } //30% 640px
        else if (random < .9) { size = '_c' } //30% 800px
        else { size = '_b' } //10% 1024px
    } else if (window_width > 810) {
        if (random < .3) { size = '' } //30% 500px
        else if (random < .8) { size = '_z' } //50% 640px
        else { size = '_c' } //20% 800px
    } else if (window_width > 650) {
        size = '_z' //100% 640px
    } else if (window_width > 510) {
        size = '_z' //100% 500px
    } else {
        size = '_n' //100% 320px
    }
    return size;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var display = function(gallery) {
    var window_width = $(window).width();
    if (window_width < 651) {  photo_insertion_duration = photo_insertion_duration_mobile }
    gallery.stalactite({
        duration: photo_insertion_duration,
        easing: 'swing', 
        cssPrep: true,
        loader: '<img />',
        fluid: false   
    });
    gallery.fadeIn();
}
