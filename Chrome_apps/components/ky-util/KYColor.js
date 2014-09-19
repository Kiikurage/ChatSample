var KYColor = (function() {

    function KYColor(str) {
        if (!(this instanceof KYColor)) {
            return new KYColor(str);
        }

        if (str) {
            var val = KYColor.parse(str);
            this.r = val.r;
            this.g = val.g;
            this.b = val.b;
            this.a = val.a;
        } else {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1;
        }
    }

    var ColorFormat = {
        Hex3: 0,
        Hex6: 1,
        Dec: 2,
        DecWithAlpha: 3
    };

    var regColorFormat = [];

    regColorFormat[ColorFormat.Hex3] = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
    regColorFormat[ColorFormat.Hex6] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
    regColorFormat[ColorFormat.Dec] = /^rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)$/i;
    regColorFormat[ColorFormat.DecWithAlpha] = /^rgba\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*,\s*([\d\.]*)\s*\)$/i;

    KYColor.ColorFormat = ColorFormat;

    KYColor.parse = function(str) {
        var type = 0,
            max = regColorFormat.length;
        for (; type < max; type++) {
            if (regColorFormat[type].test(str)) {
                break;
            }
        }

        if (type >= regColorFormat.length) {
            throw new Error("'" + str + "' is invalid color format.");
        }

        var ma = str.match(regColorFormat[type]),
            r, g, b, a;

        switch (type) {
            case ColorFormat.Hex3:
                r = parseInt(ma[1], 16) * 17;
                g = parseInt(ma[2], 16) * 17;
                b = parseInt(ma[3], 16) * 17;
                a = 1;
                break;

            case ColorFormat.Hex6:
                r = parseInt(ma[1], 16);
                g = parseInt(ma[2], 16);
                b = parseInt(ma[3], 16);
                a = 1;
                break;

            case ColorFormat.Dec:
                r = parseInt(ma[1], 10);
                g = parseInt(ma[2], 10);
                b = parseInt(ma[3], 10);
                a = 1;
                break;

            case ColorFormat.DecWithAlpha:
                r = parseInt(ma[1], 10);
                g = parseInt(ma[2], 10);
                b = parseInt(ma[3], 10);
                a = parseFloat(ma[4])
                break;
        }

        return {
            r: r,
            g: g,
            b: b,
            a: a
        };
    };

    KYColor.prototype.toString = function(type) {
        var res;

        switch (type) {
            case ColorFormat.Hex6:
                res = "#" +
                    ("0" + this.r.toString(16)).substr(-2) +
                    ("0" + this.g.toString(16)).substr(-2) +
                    ("0" + this.b.toString(16)).substr(-2);
                break;

            case ColorFormat.Dec:
                res = "rgb(" +
                    this.r + "," +
                    this.g + "," +
                    this.b + ")"
                break;

            case ColorFormat.DecWithAlpha:
                res = "rgba(" +
                    this.r + "," +
                    this.g + "," +
                    this.b + "," +
                    this.a + ")"
                break;

            default:
                throw new Error("Invalid Color Format.");
        }

        return res;
    };

    return KYColor;
}());
