var counter = -1;
var current;
var link = ""
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
var prev_classified_list = [];
var rules_dict = {};
var prev_labelled = {};
var changes_dict = {};

function loadPrevLabelledData(){
    $.ajax({
        url: "/rules",
        type: "GET",
        success: function(data) {
            rules = data.rules;
            for (row in rules) {
                rules_dict[row[0]] = row[1]
            }
        },
        error: function(error) {
            alert('error loading rules');
            console.log(error)
        }
    });
}

function loadChangeLog(){
    $.ajax({
        url: "/changes",
        type: "GET",
        success: function(data) {
            changes_log = data.change_log;
            for (row in changes_log) {
                changes_dict[row[0]] = row[2]
            }
        },
        error: function(error) {
            alert('error loading changes_log');
            console.log(error)
        }
    });
}

function add_info() {
    $.ajax({
        url: 'probabilityClassifier_data.json',
        dataType: 'json',
        type: 'get',
        success: function(dataset) {
            $.ajax({
                url: "/counter",
                type: "GET",
                success: function(data) {
                    counter = data.counter;
                    if (!(($.isEmptyObject(dataset[counter].data.unknown)) & ($.isEmptyObject(dataset[counter].data.classified)))) {
                        loadPrevLabelledData()
                        loadChangeLog()
                        link = 'https://play.google.com/store/apps/details?id='+dataset[counter].app+'pro&hl=en';
                        document.getElementById("app").innerHTML="<i><a href='' onclick='addiframe(); return false;'> " + dataset[counter].app + "</a></i>";
                        document.getElementById("version").innerHTML="<i> " + dataset[counter].version + "</i>";
                        document.getElementById("host").innerHTML="<i> " + dataset[counter].host + "</i>";
                        document.getElementById("path").innerHTML="<i> " + dataset[counter].path + "</i>";
                        add_data(dataset);
                        current = dataset[counter];
                    } else {
                        console.log(dataset[counter])
                        onSkip();
                    }
                    
                },
                error: function(error) {
                    alert('error loading count');
                    console.log(error)
                }
            });
        },
        error: function(error) {
            alert('error loading orders');
            console.log(error)
        }
    });
}

function showPredictionClassified(){

    document.getElementById('container_2').style.display = "block";
    for (key in current.data.classified) {
        var key_cut = key;
        if ((key.charAt(0).toUpperCase() == key.charAt(0)) && (key.charAt(1)=='_')) {
            var key_cut = key.substring(2);
        }
        if (key_cut in changes_dict) {
            // do something
        }else {
            var str = key_cut + ' : ' + current.data.classified[key];
            prev_classified_list.push(key_cut)
            createRow(key_cut, str, "container_2");
        }
    }
}

function removePredictionClassified() {
    document.getElementById("checkboxid").checked = false;
    var myNode = document.getElementById("container_2");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    document.getElementById('container_2').style.display = "none";
}


function onSkip(){
    document.getElementById("loader").style.display = "block";
    document.getElementById("form_sample").style.display = "none";

    document.getElementById('iframe1').src = "";

    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    removePredictionClassified()
    rules_dict = {};
    prev_labelled = {};
    changes_dict = {};
    
    var payload = {
        skip: 1
    };
    data_list = [];

    $.ajax({
        url: "/users",
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(payload),
        complete: function (data) {
            add_info();
        }
    });
}

// edit iframe source
function addiframe() {
    document.getElementById('iframe1').src = link;
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

function createRow(id, txt, container) {
    var div = document.createElement('div');
    var label = document.createElement('label');
    var text = document.createTextNode(txt);
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
    document.getElementById(container).appendChild(div);
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
    for (key in dataset[counter].data.unknown) {
        var key_cut = key;
        if ((key.charAt(0).toUpperCase() == key.charAt(0)) && (key.charAt(1)=='_')) {
            var key_cut = key.substring(2);
        }
        if (key_cut in rules_dict) {
            prev_labelled[key_cut] = rules_dict[key_cut];
        } else {
            var str = key_cut + ' : ' + dataset[counter].data.unknown[key];
            data_list.push(str);
            createRow(str, str, "container");
        }
        
    }
    document.getElementById("loader").style.display = "none";
    document.getElementById("form_sample").style.display = "block";
}


function onSubmit() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("form_sample").style.display = "none";
    var dict = {};
    var id;
    var change_log = {};

    for (key in prev_classified_list) {
        id = prev_classified_list[key]+"%_"+"2";
        if ((document.getElementById(id).value != null) && (document.getElementById(id).value != 0)) {
            var first = document.getElementById(prev_classified_list[key] + "%_"+"0").value;
            var second = document.getElementById(prev_classified_list[key] + "%_"+"1").value;
            change_log[prev_classified_list[key]]= categories_l3[first][second][document.getElementById(id).value];
        }
    }

    for (data in data_list) {
        id = data_list[data]+"%_"+"2";
        if ((document.getElementById(id).value != null) && (document.getElementById(id).value != 0)) {
            var first = document.getElementById(data_list[data] + "%_"+"0").value;
            var second = document.getElementById(data_list[data] + "%_"+"1").value;
            dict[data_list[data]]= categories_l3[first][second][document.getElementById(id).value];
        }
    }
    document.getElementById('iframe1').src = "";


    var payload = {
        skip: 0,
        app: current.app,
        version: current.version,
        host: current.host,
        path: current.path,
        data_unknown: JSON.stringify(dict),
        data_new_rules: dict,
        data_classified: JSON.stringify(current.data.classified),
        data_change_log: change_log,
        data_prev_labelled: JSON.stringify(prev_labelled)
    };

    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    removePredictionClassified()
    data_list = [];
    rules_dict = {};
    prev_labelled = {};
    changes_dict = {};
    
    $.ajax({
        url: "/users",
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(payload),
        complete: function (data) {
            alert('Form has been submitted.');
            add_info();
        }
    });
};

function load_function() { 
    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    data_list = [];
    add_info();
}

window.onload = load_function;




