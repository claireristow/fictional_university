import $ from 'jquery';

class Search {
    // 1. describe and create/initiate our object
    constructor() {
        this.addSearchHTML();
        this.resultsDiv = $('#search-overlay__results');
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $('#search-term');
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;
    }

    // 2. events (clicks, keyboard events, etc.)

    events() {

        // when search and close icons are clicked
        this.openButton.on('click', this.openOverlay.bind(this));
        this.closeButton.on('click', this.closeOverlay.bind(this));

        // when 2 and esc are clicked on the keyboard... 
        $(document).on('keydown', this.keyPressDispatcher.bind(this));

        // when a key is clicked in the searchbar... 
        this.searchField.on('keyup', this.typingLogic.bind(this));

    }

    // 3. methods (function, action...)

    typingLogic() {

        // if the keystroke doesn't change the search field (eg. arrow keys)
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);

            if (this.searchField.val()) {

                // search field is not blank, so show the spinner
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);

            } else {

                // search field is empty, so empty the results div
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;

            }

            
        }

        this.previousValue = this.searchField.val();
    }

    getResults() {
        console.log('getResults fired')
        $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => {
            this.resultsDiv.html(`
                <h2 class="search-overlay__section-title">General Information</h2>
                
                ${posts.length ? `<ul class="link-list min-list">` : `<p>No general information matches your search.</p>`}
                    ${posts.map(post => `<li><a href="${post.link}">${post.title.rendered}</a></li>`).join('')}
                ${posts.length ? `</ul>` : ''}
            `)
            this.isSpinnerVisible = false
        });
    }

    keyPressDispatcher(e) {

        // if "s" is pressed... 
        if (e.keyCode == 83 && !this.isOverlayOpen && !$('input', 'textarea').is(':focus')) {
            this.openOverlay();
        };

        // if "esc" is pressed... 
        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass('search-overlay--active');
        $('body').addClass('body-no-scroll');
        setTimeout(() => this.searchField.focus(), 301);
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass('search-overlay--active');
        $('body').removeClass('body-no-scroll');
        this.searchField.val('');
        this.isOverlayOpen = false;
    }

    addSearchHTML() {
        $('body').append(`
            <div class="search-overlay">
                <div class="search-overlay__top">
                    <div class="container">
                        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                        <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
                        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="container">
                    <div id="search-overlay__results"></div>
                </div>
            </div>
        `)
    }

} // end of Search class

export default Search;