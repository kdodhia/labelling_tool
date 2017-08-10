var current;
var link = ""
var link_2 = ""
var default_categories = ["Select","Advertising", "Social/Communication", "Game", "Multimedia", "Information", "App-analytic", "Personalization", "Unknown"];
/*
var categories_l1 = ["Select","Phone ID", "Phone Status", "Personal Data", "Sensor Data", "Unknown"];
var categories_l2 = [[],
                    ["Select", "ad_ID", "Instance_ID", "Hardware_ID","Unknown"],
                    ["Select","Battery/Charging", "Device model/Screen size", "Network (wifi/lte)", "Phone State", "Notification", "Foreground/Background tasks", "Unknown"],
                    ["Select","Contacts", "Calendar", "SMS", "Storage","Unknown"],
                    ["Select","Camera", "Location", "Microphone","Unknown"],
                    ["Unknown"]];

var categories_l3 = [[[]],
                    [[],
                        ["Select","Tracking signed-out user behavior", "Tracking signed-out user conversion", "Unknown"],
                        ["Select","Tracking signed-out user preferences", "Generating signed-out/anonymous user analytics", "Handling multiple installations","Anti-fraud: Enforcing free content limits / detecting Sybil attacks (/DRM)","Authentication (cookie)", "Unknown"],
                        ["Select","Managing telephony and carrier functionality", "Abuse detection: Identifying bots and DDoS attacks(/Safenet API)", "Abuse detection: Detecting high value stolen credentials", "Unknown"],
                        []],
                    [[],
                        ["Select","power management","intelligent power saving","Task Trigger (Context inference)", "Unknown"],
                        ["Select","ui customization", "advertising", "Unknown"],
                        ["Select","Task Trigger (Context inference)", "lower resolution image", "Unknown"],
                        ["Select", "Unknown"],["Select", "Unknown"],["Select", "Unknown"],[]],
                    [[],
                        ["Select","Backup and Synchronization", "Contact Management", "Blacklist", "Call and SMS", "Contact-based Customization","Email", "Find friends","Record","Fake Calls and SMS", "Remind", "Unknown"],
                        ["Select","Task Trigger (Context inference)", "Schedule", "Alarm", "Unknown"],
                        ["Select","send sms ", "organize sms (clustering, delete, re-rank)", "extract sms content (check notification)", "block sms", "send sms commands/confirmation","schedule sms", "back up/synchronize sms", "receive msg/messaging", "Unknown"],
                        ["Select","access album ", "photo editing", "data backup", "download", "persistent logging", "Unknown"],
                        []],
                    [[],
                        ["Select","Flashlight (activate, encode)", "Video streaming/Video chat", "QRCode/Barcode scan", "Document scan (biz card, coupon, check)", "Augment reality","Social Media (sharing, communication)","Text recognition (translation, )", "Unknown"],
                        ["Select","Search Nearby Places", "Location-based Customization ", "Transportation Information", "Recording","Map and Navigation", "Geosocial Networking","Geotagging", "Location Spoofing", "Alert and Remind", "Location-based game", "Unknown"],
                        ["Select","sound/blow detection", "voice message", "video/voice calling", "voice control/command", "speech recognition","audio/video recording","* call recording", "advertising","authentication","data transmission","music", "Unknown"],
                        []],
                    [[]]];
*/

var categories_l1 = ["Select","id", "phone", "personal", "sensor", "general", "junk", "other"];
var categories_l2 = [[],
                    ["Select", "adid", "instanceid", "hwid", "app", "unknown"],
                    ["Select","battery", "device", "network", "phonestate", "notification", "tasks", "appinfo", "unknown"],
                    ["Select","contact", "calendar", "sms", "storage", "account", "unknown"],
                    ["Select","camera", "location", "microphone", "accelerometer", "gyroscope", "proximity", "unknown"],
                    ["Select","health", "emergency", "advertisement", "analytic", "sharing", "time", "appinfo", "unknown"],
                    ["junk"]];

var categories_l3 = [[[]],
                    [[],
                        ["Select","Tracking signed-out user behavior", "Tracking signed-out user conversion", "unknown"],
                        ["Select","Tracking signed-out user preferences", "Generating signed-out/anonymous user analytics", "Handling multiple installations","Anti-fraud: Enforcing free content limits / detecting Sybil attacks (/DRM)","Authentication (cookie)", "unknown"],
                        ["Select","Managing telephony and carrier functionality", "Abuse detection: Identifying bots and DDoS attacks(/Safenet API)", "Abuse detection: Detecting high value stolen credentials", "unknown"],
                        ["Select", "unknown"],["unknown"]],
                    [[],
                        ["Select","power management","intelligent power saving","Task Trigger (Context inference)", "unknown"],
                        ["Select","ui customization", "advertising", "language", "OS info","Manufacturer", "unknown"],
                        ["Select","Task Trigger (Context inference)", "lower resolution image", "unknown"],
                        ["Select","call state", "screen light", "unknown"],
                        ["Select", "UI Personalization (lock screen)", "Interruption management", "unknown"],
                        ["Select", "Task management", "Cross app communciation", "unknown"],
                        ["Select", "SDK", "Package ID", "unknown"], []],
                    [[],
                        ["Select","Backup and Synchronization", "Contact Management", "Blacklist", "Call and SMS", "Contact-based Customization","Email", "Find friends","Record","Fake Calls and SMS", "Remind", "unknown"],
                        ["Select","Task Trigger (Context inference)", "Schedule", "Alarm", "unknown"],
                        ["Select","send sms ", "organize sms (clustering, delete, re-rank)", "extract sms content (check notification)", "block sms", "send sms commands/confirmation","schedule sms", "back up/synchronize sms", "receive msg/messaging", "unknown"],
                        ["Select","access album ", "photo editing", "data backup", "download", "persistent logging", "unknown"],
                        ["Select", "unknown"],
                        []],
                    [[],
                        ["Select","Flashlight (activate, encode)", "Video streaming/Video chat", "QRCode/Barcode scan", "Document scan (biz card, coupon, check)", "Augment reality","Social Media (sharing, communication)","Text recognition (translation, )", "unknown"],
                        ["Select","Search Nearby Places", "Location-based Customization ", "Transportation Information", "Recording","Map and Navigation", "Geosocial Networking","Geotagging", "Location Spoofing", "Alert and Remind", "Location-based game", "unknown"],
                        ["Select","sound/blow detection", "voice message", "video/voice calling", "voice control/command", "speech recognition","audio/video recording","* call recording", "advertising","authentication","data transmission","music", "unknown"],
                        ["Select", "Game", "step-counter","unknown"],
                        ["Select", "game", "compass", "step-counter", "unknown"],["Select", "Game", "Speaker/display activation", "unknown"],[]],
                    [[],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"],
                        ["unknown"]],
                    [["junk"]]];

var data_list = [];
var function_classified_list = [];
var rules_dict = {}
var prev_labelled = {};
var original_classifiers = {};
var already_classified_list = [];
var available = []

function findAvailable(dataset) {
    for (row in dataset) {
        cur_host  = dataset[row].host;
        cur_path = dataset[row].path;
        var flag = false;
        for (inst in already_classified_list) {
            if (already_classified_list[inst][0] == cur_host) {
                if (already_classified_list[inst][1] == cur_path) {
                    flag = true
                }
            }
        } 
        if (!flag) {
            available.push(dataset[row])
        }
    }
}

function add_info() {
    $.ajax({
        url: 'probabilityClassifier_data.json',
        dataType: 'json',
        type: 'get',
        success: function(dataset) {

            $.ajax({
                url: "/already_classified",
                type: "GET",
                success: function(data) {
                    temp = data.al_classified;
                    for (row in temp) {
                        already_classified_list.push([temp[row].host, temp[row].path]);
                    }
                    findAvailable(dataset);
                    if (available.length < 1) {
                        alert('Labelling Complete.');
                    } else {
                        current = available[Math.floor(Math.random() * available.length)];
                        if (!(($.isEmptyObject(current.data.unknown)) & ($.isEmptyObject(current.data.classified)))) {
                        
                            $.ajax({
                                url: "/rules",
                                type: "GET",
                                success: function(data_rule) {
                                    rules = data_rule.rules;
                                    for (row in rules) {
                                        rules_dict[rules[row].value] = rules[row].classifier
                                    }
                                    link = 'https://play.google.com/store/apps/details?id='+current.app;
                                    link_2 = 'https://www.google.com/search?q=' + current.app;
                                    document.getElementById("app").innerHTML="<i><a href='' onclick='addiframe(); return false;'> " + current.app + "</a></i>";
                                    document.getElementById("version").innerHTML="<i> " + current.version + "</i>";
                                    document.getElementById("host").innerHTML="<i> " + current.host + "</i>";
                                    document.getElementById("path").innerHTML="<i> " + current.path + "</i>";
                                    add_data();
                                    showPartiallyClassified();
                                    showClassified();
                                    if ((data_list.length < 1) && (function_classified_list.length < 1)) {
                                        onSubmit();
                                    }
                                },
                                error: function(error) {
                                    alert('error loading rules');
                                    console.log(error)
                                }
                            });

                        } else {
                            onSubmit();
                        }
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


function setCols(id, data) {
    sub_one = id+"%_"+"0";
    sub_two = id+"%_"+"1";
    sub_three = id+"%_"+"2";
    var temp = data.split(".")
    idx_one = categories_l1.indexOf(temp[0]);
    idx_two = categories_l2[idx_one].indexOf(temp[1]);
    document.getElementById(sub_one).value = idx_one;
    add_options(sub_two, categories_l2[idx_one]);
    document.getElementById(sub_two).value = idx_two;
    document.getElementById(sub_two).style.visibility = "visible";
    add_options(sub_three, categories_l3[idx_one][idx_two]);
    document.getElementById(sub_three).style.visibility = "visible";
}

function showPartiallyClassified(){

    document.getElementById('container_2').style.display = "block";
    for (key in current.data.classified) {
        var key_cut = key;
        if ((key.charAt(1)=='_')) {
            var key_cut = key.substring(2);
        }
        var temp  = key_cut.split(' : ')
        adjusted_key = temp[0]
        if (adjusted_key in rules_dict) {
            prev_labelled[key_cut] = rules_dict[adjusted_key];
        } else {
            var str = key_cut;
            function_classified_list.push(key_cut)
            createRow(key_cut, str, "container_2");
            setCols(key_cut, current.data.classified[key])
            original_classifiers[key_cut] = current.data.classified[key]
        }
    }
}

function showClassified() {
    for (key in prev_labelled) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var text = document.createTextNode('"' + key + '"   : ' + prev_labelled[key]);
        label.appendChild(text);
        
        div.appendChild(label);
        var linebreak = document.createElement('br');
        div.appendChild(linebreak);
        
        document.getElementById("container_3").appendChild(div);
    }
}

function removePredictionClassified() {
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
    var myNode = document.getElementById("container_3");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    removePredictionClassified()
    data_list = [];
    function_classified_list = [];
    rules_dict = {};
    prev_labelled = {};
    original_classifiers = {};
    already_classified_list = [];
    available = []
    
    var payload = {
        skip: 1,
        app: current.app,
        version: current.version,
        host: current.host,
        path: current.path
    };

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
    try {
        document.getElementById('iframe1').src = link_2;
    } 
    catch(err) {
        document.getElementById('iframe1').src = link_2;
    }
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
    var input = document.createElement('input');
    input.type = "text"; 
    input.placeholder = "Please Specify"

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
    input.id = id+"%_"+"3";

    var x;
    var t;
    for (value in categories_l1) {
        x = document.createElement("option");
        t = document.createTextNode(categories_l1[value]);
        x.appendChild(t);
        x.value = value;
        sub_one.appendChild(x);
    }
    var div_dropdown = document.createElement('div');
    div_dropdown.style.marginLeft = "400px"
    div_dropdown.appendChild(sub_one);
    div_dropdown.appendChild(sub_two);
    div_dropdown.appendChild(sub_three);
    div_dropdown.appendChild(input);
    sub_two.style.visibility = "hidden";
    sub_three.style.visibility = "hidden";
    input.style.visibility = "hidden";
    sub_one.style.width = "75px"
    sub_two.style.width = "100px"
    sub_three.style.width = "250px"

    div.appendChild(div_dropdown);
    
    document.getElementById(container).appendChild(div);
}

function onChange(id) {
    var index = document.getElementById(id).value;
    var level = id.slice(-1);
    sliced = id.substring(0, id.length-1);

    if (level == "0") {

        var inputNode = document.getElementById(sliced + "3");
        while (inputNode.firstChild) {
            inputNode.removeChild(inputNode.firstChild);
        }
        inputNode.style.visibility = "hidden";

        var curNode = document.getElementById(sliced + "1");
        curNode.style.width = "100px"
    
        curNode.style.visibility = "visible";
        while (curNode.firstChild) {
            curNode.removeChild(curNode.firstChild);
        }

        var nextNode = document.getElementById(sliced + "2");
        nextNode.style.width = "250px"
        if (nextNode != null) {
            while (nextNode.firstChild) {
                nextNode.removeChild(nextNode.firstChild);
            }
            nextNode.style.visibility = "hidden";
        }

        if (index == 0) {
            curNode.style.visibility = "hidden";
        }

        idx_other = categories_l1.indexOf("other");
        if (index == idx_other) {
            inputNode = document.getElementById(sliced + "3");
            curNode.style.width = "0px"
            nextNode.style.width = "0px"
            inputNode.style.visibility = "visible";
        } else {
            add_options(sliced + "1", categories_l2[index]);
        }
    } else if (level == "1") {

        var prev = document.getElementById(sliced + "0").value;
        var curNode = document.getElementById(sliced + "2");
        curNode.style.visibility = "visible";
        while (curNode.firstChild) {
            curNode.removeChild(curNode.firstChild);
        }
        if (index == 0) {
            curNode.style.visibility = "hidden";
        }
        add_options(sliced + "2", categories_l3[prev][index])
    }
}


function add_data(){   
    for (key in current.data.unknown) {
        var key_cut = key;
        if ((key.charAt(1)=='_')) {
            var key_cut = key.substring(2);
        }
        if (key_cut in rules_dict) {
            prev_labelled[key_cut] = rules_dict[key_cut];
        } else {
            val = current.data.unknown[key];
            if (val.length > 20) {
                val = val.substring(0, 20) + "...";
            }
            var str = key_cut + ' : ' + val;
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
    var unknown_classified = {};
    var id;
    var partially_known_classified = {};
    var rules = {}
    var classifier;
    var change_log = []

    for (key in function_classified_list) {
        id_first = function_classified_list[key]+"%_"+"0";
        idx_other = categories_l1.indexOf("other");
        if (document.getElementById(id_first).value == idx_other) {
            id_input = function_classified_list[key]+"%_"+"3";
            val = document.getElementById(id_input).value
            if (val != null) {
                partially_known_classified[function_classified_list[key]]= val;
                adjusted_key = function_classified_list[key].split(' : ')
                rules[adjusted_key[0]]= val;

                var list = [adjusted_key[0], original_classifiers[function_classified_list[key]], val]
                change_log.push(list)
            }
        }
        id = function_classified_list[key]+"%_"+"2";
        if ((document.getElementById(id).value != null) && (document.getElementById(id).value != 0)) {
            var first = document.getElementById(function_classified_list[key] + "%_"+"0").value;
            var second = document.getElementById(function_classified_list[key] + "%_"+"1").value;
            classifier = categories_l1[first] + '.' + categories_l2[first][second]
            if (original_classifiers[function_classified_list[key]] != classifier) {
                adjusted_key = function_classified_list[key].split(' : ')
                var list = [adjusted_key[0], original_classifiers[function_classified_list[key]], classifier]
                change_log.push(list)
            }
            var second_id = function_classified_list[key]+"%_"+"1";
            str = categories_l1[first] + "."+ categories_l2[first][document.getElementById(second_id).value] + "."+categories_l3[first][second][document.getElementById(id).value]
            partially_known_classified[function_classified_list[key]]= str;
            adjusted_key = function_classified_list[key].split(' : ')
            rules[adjusted_key[0]]= str;
        }
    }

    for (data in data_list) {
        id_first = data_list[data]+"%_"+"0";
        idx_other = categories_l1.indexOf("other");
        if (document.getElementById(id_first).value == idx_other) {
            id_input = data_list[data]+"%_"+"3";
            val = document.getElementById(id_input).value
            if (val != null) {
                unknown_classified[data_list[data]]= val;
                adjusted_key = data_list[data].split(' : ')
                rules[adjusted_key[0]]= val;
            }
        }
        id = data_list[data]+"%_"+"2";
        if ((document.getElementById(id).value != null) && (document.getElementById(id).value != 0)) {
            var first = document.getElementById(data_list[data] + "%_"+"0").value;
            var second = document.getElementById(data_list[data] + "%_"+"1").value;
            var second_id = data_list[data]+"%_"+"1";
            str = categories_l1[first] + "." + categories_l2[first][document.getElementById(second_id).value] + "." + categories_l3[first][second][document.getElementById(id).value]
            unknown_classified[data_list[data]]= str;
            adjusted_key = data_list[data].split(' : ')
            rules[adjusted_key[0]]= str;
        }
    }

    document.getElementById('iframe1').src = "";


    var payload = {
        skip: 0,
        app: current.app,
        version: current.version,
        host: current.host,
        path: current.path,
        data_unknown_classified: JSON.stringify(unknown_classified),
        data_partially_known_classified: JSON.stringify(partially_known_classified),
        data_prev_labelled: JSON.stringify(prev_labelled),
        rules_dict: rules,
        data_change_log: change_log
    };

    var myNode = document.getElementById("container");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    var myNode = document.getElementById("container_3");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    removePredictionClassified()
    data_list = [];
    function_classified_list = [];
    rules_dict = {};
    prev_labelled = {};
    original_classifiers = {};
    already_classified_list = [];
    available = []
    
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




