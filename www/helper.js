var counter = -1;
var current;
var default_categories = ["Select","Advertising", "Social/Communication", "Game", "Multimedia", "Information", "App-analytic", "Personalization", "Unknown"];
var categories_l1 = ["Select","Phone ID", "Phone Status", "Personal Data", "Sensor Data", "Unknown"];
var categories_l2 = [[],
                    ["Select", "ad ID", "Instance ID", "Hardware ID","Unknown"],
                    ["Select","Battery/Charging", "Device model/Screen size", "Network (wifi/lte)", "Phone State", "Notification", "Foreground/Background tasks", "Unknown"],
                    ["Select","Contacts", "Calendar", "SMS", "Storage","Unknown"],
                    ["Select","Camera", "Location", "Microphone","Unknown"],
                    []];

var categories_l3 = [[[]],
                    [[],
                        ["Select","Tracking signed-out user behavior", "Tracking signed-out user conversion"],
                        ["Select","Tracking signed-out user preferences", "Generating signed-out/anonymous user analytics", "Handling multiple installations","Anti-fraud: Enforcing free content limits / detecting Sybil attacks (/DRM)","Authentication (cookie)"],
                        ["Select","Managing telephony and carrier functionality", "Abuse detection: Identifying bots and DDoS attacks(/Safenet API)", "Abuse detection: Detecting high value stolen credentials"],
                        []],
                    [[],
                        ["Select","power management","intelligent power saving","Task Trigger (Context inference)"],
                        ["Select","ui customization", "advertising"],
                        ["Select","Task Trigger (Context inference)", "lower resolution image"],
                        [],[],[],[]],
                    [[],
                        ["Select","Backup and Synchronization", "Contact Management", "Blacklist", "Call and SMS", "Contact-based Customization","Email", "Find friends","Record","Fake Calls and SMS", "Remind"],
                        ["Select","Task Trigger (Context inference)", "Schedule", "Alarm"],
                        ["Select","send sms ", "organize sms (clustering, delete, re-rank)", "extract sms content (check notification)", "block sms", "send sms commands/confirmation","schedule sms", "back up/synchronize sms", "receive msg/messaging"],
                        ["Select","access album ", "photo editing", "data backup", "download", "persistent logging"],
                        []],
                    [[],
                        ["Select","Flashlight (activate, encode)", "Video streaming/Video chat", "QRCode/Barcode scan", "Document scan (biz card, coupon, check)", "Augment reality","Social Media (sharing, communication)","Text recognition (translation, )"],
                        ["Select","Search Nearby Places", "Location-based Customization ", "Transportation Information", "Recording","Map and Navigation", "Geosocial Networking","Geotagging", "Location Spoofing", "Alert and Remind", "Location-based game"],
                        ["Select","sound/blow detection", "voice message", "video/voice calling", "voice control/command", "speech recognition","audio/video recording","* call recording", "advertising","authentication","data transmission","music"],
                        []],
                    [[]]];
var data_list = [];

function add_info() {
    $.ajax({
        url: 'dec29_100.json',
        dataType: 'json',
        type: 'get',
        success: function(dataset) {
            document.getElementById("app").innerHTML="<i> " + dataset[counter].app + "</i>";
            document.getElementById("version").innerHTML="<i> " + dataset[counter].version + "</i>";
            document.getElementById("host").innerHTML="<i> " + dataset[counter].host + "</i>";
            document.getElementById("path").innerHTML="<i> " + dataset[counter].path + "</i>";
            add_data(dataset);
            current = dataset[counter];
            console.log(current);
        },
        error: function() {
            alert('error loading orders');
        }
    });
}

function add_options(id, list) {
    for (value in list) {
        var x = document.createElement("OPTION");
        var t = document.createTextNode(list[value]);
        x.appendChild(t);
        x.value = value;
        x.name = list[parseInt(value)];
        document.getElementById(id).appendChild(x);
    }
}

function createRow(id) {
    var div = document.createElement('div');
    var label = document.createElement('label');
    var text = document.createTextNode(id);
    var span = document.createElement('span');
    div.className = 'line';
    label.appendChild(text);
    label.appendChild(span);
    
    div.appendChild(label);

    var sub_one = document.createElement('select');
    var sub_two = document.createElement('select');
    var sub_three = document.createElement('select');

    sub_one.addEventListener("change", function() {
        onChange(this.id);
    });
    sub_two.addEventListener("change", function() {
        onChange(this.id);
    });
    sub_three.addEventListener("change", function() {
        onChange(this.id);
    });
    
    sub_one.id = id+"%_"+"0";
    sub_two.id = id+"%_"+"1";
    sub_three.id = id+"%_"+"2";

    var x;
    var t;

    for (value in categories_l1) {
        x = document.createElement("option");
        t = document.createTextNode(categories_l1[value]);
        x.appendChild(t);
        x.index = value;
        x.value = value;
        x.name = categories_l1[value];
        sub_one.appendChild(x);
    }

    div.appendChild(sub_one);
    div.appendChild(sub_two);
    div.appendChild(sub_three);
    sub_two.style.visibility = "hidden";
    sub_three.style.visibility = "hidden";
    document.getElementById('container').appendChild(div);
}

function onChange(id) {
    var index = document.getElementById(id).value;
    var level = id.slice(-1);
    sliced = id.substring(0, id.length-1);

    if (level == "0") {

        var curNode = document.getElementById(sliced + "1");
        curNode.style.visibility = "visible";
        while (curNode.firstChild) {
            curNode.removeChild(curNode.firstChild);
        }

        var nextNode = document.getElementById(sliced + "2");
        if (nextNode != null) {
            while (nextNode.firstChild) {
                nextNode.removeChild(nextNode.firstChild);
            }
            nextNode.style.visibility = "hidden";
        }

        if (index == 0 || index == 5) {
            curNode.style.visibility = "hidden";
        }

        add_options(sliced + "1", categories_l2[index]);

    } else if (level == "1") {

        var prev = document.getElementById(sliced + "0").value;
        var curNode = document.getElementById(sliced + "2");
        curNode.style.visibility = "visible";
        while (curNode.firstChild) {
            curNode.removeChild(curNode.firstChild);
        }
        if (index == 0 || index == categories_l2[prev].length-1) {
            curNode.style.visibility = "hidden";
        }
        add_options(sliced + "2", categories_l3[prev][index])
    }
}


function add_data(dataset){    
    for (i = 0; i < dataset[counter].data.length; i++) {
        data_list.push(dataset[counter].data[i]);
        createRow(dataset[counter].data[i]);      
    }
}


function onSubmit() {
    if (document.getElementById("options").value == 0)  {
        alert('Please choose a category.')
        return;
    }
    var dict = {};
    var id;

    for (data in data_list) {
        id = data_list[data]+"%_"+"2";
        if ((document.getElementById(id).value != null) && (document.getElementById(id).value != 0)) {
            var first = document.getElementById(data_list[data] + "%_"+"0").value;
            var second = document.getElementById(data_list[data] + "%_"+"1").value;
            dict[data_list[data]]= categories_l3[first][second][document.getElementById(id).value];
        }
    }

    alert('Form has been submitted.');

    var payload = {
        app: current.app,
        version: current.version,
        host: current.host,
        path: current.path,
        data: JSON.stringify(dict),
        category: default_categories[document.getElementById("options").value]
    };

    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    data_list = [];
    
    $.ajax({
        url: "/users",
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(payload),
        complete: function (data) {
            counter++;
            add_info();
        }
    });

};

function load_function() { 
    $.ajax({
        url: "/counter",
        type: "GET",
        success: function(dataset) {
            if (counter == -1) {
                counter = dataset.counter;
            }
        }
    });
    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    data_list = [];
    add_info();
    add_options("options", default_categories);
}

window.onload = load_function;




