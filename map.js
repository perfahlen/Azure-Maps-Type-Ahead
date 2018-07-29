const MapsAccountKey = "";
let map = new atlas.Map("map", {
    "subscription-key": MapsAccountKey
});

const searchInput = document.querySelector("#searchbox");

let awesomplete = new Awesomplete(searchInput, {
    minChars: 1,
    autoFirst: true
  });

let getSuggestions= function(){    
    const arg = searchInput.value.trim();
    if (arg.length <= 7) return;

    let req = new XMLHttpRequest();
    let reqUrl = `https://atlas.microsoft.com/search/address/json?subscription-key=${MapsAccountKey}&api-version=1.0&typeahead=true&query=${arg}`;
    req.open("GET", reqUrl);
    req.onload = function(){
        let list = JSON.parse(req.responseText);
        let resultList = list.results.map(function(p){return{label: p.address.freeformAddress, value: p.address};});
        awesomplete.list = resultList; 
    };
    req.send();
}

searchInput.addEventListener("keydown", (evt) => {
    getSuggestions();
});

const selectedAddress = function(selectedLocation){
    const selectedVal = selectedLocation.text.value;
    document.querySelector("#searchbox").value = selectedVal.freeformAddress;
    document.querySelector("#streetname").value = `${selectedVal.streetName} ${selectedVal.streetNumber || ''}`;
    document.querySelector("#zipcode").value = selectedVal.postalCode;
    document.querySelector("#city").value = selectedVal.municipalitySubdivision;
}

Awesomplete.$.bind(searchInput, { "awesomplete-selectcomplete": selectedAddress });