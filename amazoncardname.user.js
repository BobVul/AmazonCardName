// ==UserScript==
// @name          AmazonCardName
// @namespace     http://vulpin.com/
// @description	  Give a descriptive name to Amazon cards
// @match         *://*.amazon.com/*
// @match         *://*.amazon.com.au/*
// @match         *://*.amazon.co.uk/*
// @match         *://*.amazon.de/*
// @version       1.0.0
// @grant         none
// ==/UserScript==

(function() {
var Storage = function(prefix) {
    this.storagePrefix = prefix + '-';
};

Storage.prototype.getItem = function(key) {
    return localStorage.getItem(this.storagePrefix + key);
};
    
Storage.prototype.setItem = function(key, value) {
    localStorage.setItem(this.storagePrefix + key, value);
}

var Program = {
    paymentMethods: [],

    main: function() {
        window.removeEventListener('load', mainEventListener, false);
        
        if (!document.getElementById('existing-payment-methods')) {
            return;
        }
        
        this.storage = new Storage('amazoncardname');
        
        this.attachNames();
    },
    
    attachNames: function() {
        var rows = document.querySelectorAll('.payment-row');
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var paymentId = row.getAttribute('paymentmethodid');
            
            var infoEl = row.querySelector('.card-info');
            var nameEl = document.createElement('span');
            
            var nameText = this.storage.getItem(paymentId) || 'unnamed';
            
            nameEl.classList.add('a-color-secondary');
            nameEl.contentEditable = true;
            nameEl.setAttribute('paymentmethodid', paymentId);
            nameEl.addEventListener('input', this.nameEdited.bind(this), false);
            nameEl.textContent = nameText;
            
            infoEl.appendChild(nameEl);
        }
    },
    
    nameEdited: function(ev) {
        var el = ev.target;
        var paymentId = el.getAttribute('paymentmethodid');
        
        this.storage.setItem(paymentId, el.textContent);
    }
};

var mainEventListener = Program.main.bind(Program);

window.addEventListener('load', mainEventListener, false);
})();