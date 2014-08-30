var EmployeeView = function(employee) {

    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.add-location-btn', this.addLocation);
        this.el.on('click', '.add-contact-btn', this.addToContacts);
        this.el.on('click', '.change-pic-btn', this.changePicture);
    };

    this.render = function() {
        this.el.html(EmployeeView.template(employee));
        return this;
    };

    this.changePicture = function(event) {
        event.preventDefault();
        if (!navigator.camera) {
            app.showAlert("Camera API not supported", "Error");
            return;
        }
        var options =   {   quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            function(imageData) {
                $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
            },
            function() {
                app.showAlert('Error taking picture', 'Error');
            },
            options);

        return false;
    };

    this.addToContacts = function(event) {

        function onSuccess(contact) {
            alert("Save Success");
        }

        function onError(contactError) {
            alert("Error = " + contactError.code);
        }

        event.preventDefault();
        if (!navigator.contacts) {
            app.showAlert("Contacts API not supported", "Error");
            return;
        }
        var contact = navigator.contacts.create();
        contact.name = {givenName: employee.firstName,
            familyName: employee.lastName
        };
        contact.displayName = employee.lastName + " " + employee.firstName;
        contact.nickname = employee.firstName;
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
        phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
        contact.phoneNumbers = phoneNumbers;
//        photos[0] = new ContactField('jpg', 'img/{{firstName}}_{{lastName}}.jpg');
//        contact.photos = photos;
        contact.save(onSuccess,onError);
        return false;
    };

    this.addLocation = function(event) {
        event.preventDefault();
//        console.log('addLocation');
        if (!navigator.geolocation) {
            app.showAlert("Location API not supported");
            return;
        }

        var onSuccess = function(position) {
            app.showAlert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
        };

// onError Callback receives a PositionError object
//
        function onError(error) {
            app.showAlert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        app.showAlert('Latitude done.');

//        navigator.geolocation.getCurrentPosition(
//            function(position) {
//                app.showAlert("Get Current Position");
//                $('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
//                app.showAlert("Get Current Position");
//            },
//            function() {
//                app.showAlert("Error getting locatio");
//            });
//        return false;
    };

    this.initialize();

};

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());