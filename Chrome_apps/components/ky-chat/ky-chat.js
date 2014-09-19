function extend(to) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, max = sources.length; i < max; i++) {
        var source = sources[i];
        for (var key in source) {
            to[key] = source[key];
        }
    }
    return to;
}

var ajax = (function() {
    var ajax = {};

    ajax.get = function(url, params) {
        if (params) {
            url += "?" + ajax.encodeURLParam(params);
        }

        return ajax.core(url, "GET");
    };

    ajax.post = function(url, params) {
        return ajax.core(url, "POST", {
            "Content-type": "application/x-www-form-urlencoded"
        }, ajax.encodeURLParam(params));
    };

    ajax.core = function(url, method, header, body) {
        var xhr = new XMLHttpRequest(),
            defer = Promise.defer();

        xhr.open(method, url);

        if (header) {
            for (var key in header) {
                xhr.setRequestHeader(key, header[key]);
            }
        }

        xhr.addEventListener("load", function() {
            defer.resolve(xhr.responseText);
        });
        xhr.addEventListener("error", function() {
            defer.reject(xhr);
        });
        xhr.send(body || "");

        return defer.promise;
    };

    ajax.encodeURLParam = function(obj) {
        var tokens = [];
        for (var k in obj) {
            tokens.push(k + "=" + encodeURIComponent(obj[k]));
        }
        return tokens.join("&");
    };

    return ajax;
}());

var Post = (function() {
    function Post(obj) {
        extend(this, {
            id: Date.now(),
            text: "",
            username: "",
            timestamp: Date.now()
        }, obj || {});
    }

    return Post;
}());

Polymer("ky-chat", {
    publish: {
        geturl: {
            value: "./php/get.php",
            reflect: true
        },
        seturl: {
            value: "./php/set.php",
            reflect: true
        },
        update: {
            value: true,
            reflect: true
        }
    },
    updateChanged: function(oldVal, newVal) {
        if (oldVal !== newVal) {
            if (newVal) {
                this.sync();
            }
        }
    },
    ready: function() {
        this.data = [];
        this.sync();
        this.$.form.addEventListener("submit", this.btnSubmitClickAction.bind(this));
    },
    sync: function() {
        var self = this;
        return ajax
            .get(this.geturl, {
                key: "chat"
            })
            .then(function(json) {
                self.data = self.parseServerResponse(JSON.parse(json));
            })
            .then(function() {
                if (self.update) {
                    setTimeout(function() {
                        self.sync();
                    }, 1000);
                }
            });
    },
    newPost: function(username, text) {
        var post = new Post({
            username: username,
            text: text
        });

        var self = this;

        return ajax
            .post(this.seturl, {
                key: "chat",
                val: JSON.stringify(post)
            })
            .then(function(d) {
                console.log(d);
                self.sync();
            });
    },

    parseServerResponse: function(data) {
        var res = {
            posts: []
        };

        var _posts = data.posts,
            posts = res.posts;
        for (var i = 0, max = _posts.length; i < max; i++) {
            posts.push(new Post(_posts[i]));
        }

        return res;
    },
    btnSubmitClickAction: function(ev) {
        var name = this.$.inputName.value,
            text = this.$.inputText.value,
            self = this;
        if (!name || !text) {
            return;
        }

        this.newPost(name, text)
            .then(function() {
                self.$.inputText.value = "";
            });

        ev.preventDefault();
    }
});
