////meta_an2() for drop_ex_js.htm for doing meta-analysis with JavaScrip. No prediction interval.
///Output contains yi, vi, beta, vb for calculating Begg, Egger asymmetry evaluation (same as metafor regtest, ranktest).
///REML is used for among-study variance.
///2025.01.13 Begg & Mazumdar's test added. Kendall's tau with ties is calculated. p-value is based on Z score, which is difference from metafor when sample size is small.
///2025.01.29 When meta-analysis is done, estimates with 95% CI and summary values with CI are stored in the Clipboard in meta_an2().
//---------------------------------------------------------------
/////Copy the result text area to clipboar.
function copy_dat(bs)
{
if(bs==1){
document.dat.metaresult.focus();
document.dat.metaresult.select();
document.execCommand("copy");
return false;
}
if(bs==0){
document.dat.metadata.focus();
document.dat.metadata.select();
document.execCommand("copy");	
return false;
}
}
///--------------------------------------------------------------
//For doing meta-analysis for the formulated data put in the total comment text area which is copied via clipboar from Excel.
function meta_an2(exdat) {
    var ichi = [];
    var exdatl = exdat.split("\n");
    ichi = exdatl[0].split("\t");

    if (ichi[5] !== "label" && ichi[7] !== "label") {
        alert("Data format does not fit.");
        return false;
    }

    var i;
    var j;
    ichi = exdatl[0].split("\t");
    for (i = 0; i < ichi.length; i++) {
        if (ichi[i] === "label") {
            j = i;
            break;
        }
    }

    ichi = exdatl[6].split("\t");
    var em_labe = ichi[j];

    ichi = exdatl[10].split("\t");
    var revoreve = (ichi[j] === "Event" || ichi[j] === "" || ichi[j] === null || ichi[j] === 'undefined') ? "event" : "reverse";
    // dlreml is always "reml" based on the original code's explicit assignment.
    var dlreml = "reml";

    var nco = [];
    var rco = [];
    var nto = [];
    var rto = [];
    var stid = [];
    var nc = [];
    var rc = [];
    var nt = [];
    var rt = [];

    var std_labe;
    var cont_labe;
    var inter_labe;
    var outc_labe;

    if (em_labe === "RR" || em_labe === "RD" || em_labe === "OR") {
        for (i = 1; i < exdatl.length; i++) {
            if (exdatl[i] !== "") {
                var ichi_row = exdatl[i].split("\t");
                if (ichi_row[0] !== "") {
                    stid[i - 1] = ichi_row[0];
                    nco[i - 1] = ichi_row[1];
                    rco[i - 1] = ichi_row[2];
                    nto[i - 1] = ichi_row[3];
                    rto[i - 1] = ichi_row[4];
                }
                if (i === 1) {
                    std_labe = ichi_row[5];
                }
                if (i === 2) {
                    cont_labe = ichi_row[5];
                }
                if (i === 3) {
                    inter_labe = ichi_row[5];
                }
                if (i === 4) {
                    outc_labe = ichi_row[5];
                }
            }
        }
    }

    var mc = [];
    var sc = [];
    var mt = [];
    var st = [];
    if (em_labe === "MD" || em_labe === "SMD") {
        for (i = 1; i < exdatl.length; i++) {
            if (exdatl[i] !== "") {
                var ichi_row = exdatl[i].split("\t");
                if (ichi_row[0] !== "") {
                    stid[i - 1] = ichi_row[0];
                    nc[i - 1] = ichi_row[1];
                    mc[i - 1] = ichi_row[2];
                    sc[i - 1] = ichi_row[3];
                    nt[i - 1] = ichi_row[4];
                    mt[i - 1] = ichi_row[5];
                    st[i - 1] = ichi_row[6];
                }
                if (i === 1) {
                    std_labe = ichi_row[7];
                }
                if (i === 2) {
                    cont_labe = ichi_row[7];
                }
                if (i === 3) {
                    inter_labe = ichi_row[7];
                }
                if (i === 4) {
                    outc_labe = ichi_row[7];
                }
            }
        }
        nco = nc;
        nto = nt;
    }

    var seh = [];
    if (em_labe === "HR") {
        for (i = 1; i < exdatl.length; i++) {
            if (exdatl[i] !== "") {
                var ichi_row = exdatl[i].split("\t");
                if (ichi_row[0] !== "") {
                    stid[i - 1] = ichi_row[0];
                    nt[i - 1] = ichi_row[1];
                    nc[i - 1] = ichi_row[2];
                    mt[i - 1] = ichi_row[3];
                    seh[i - 1] = ichi_row[4];
                }
                if (i === 1) {
                    std_labe = ichi_row[5];
                }
                if (i === 2) {
                    cont_labe = ichi_row[5];
                }
                if (i === 3) {
                    inter_labe = ichi_row[5];
                }
                if (i === 4) {
                    outc_labe = ichi_row[5];
                }
            }
        }
        nco = nc;
        nto = nt;
    }

    var k = stid.length;
    var emtype;
    var emtypes = em_labe.toLowerCase(); // Directly use em_labe as emtypes.

    if (emtypes === "rr") {
        emtype = "rr";
    }
    if (emtypes === "rd") {
        emtype = "rd";
    }
    if (emtypes === "or") {
        emtype = "or";
    }
    if (emtypes === "md") {
        emtype = "md";
    }
    if (emtypes === "smd") {
        emtype = "smd";
    }
    if (emtypes === "hr") {
        emtype = "hr";
    }

    var em_labes = em_labe; // em_labes is always the same as em_labe.

    var altmsg = "The selected effect measure: " + em_labes;
    if (revoreve === "reverse") {
        altmsg = altmsg + "\n for the reversed outcome to \"" + outc_labe + "\".";
        outc_labe = "non-" + outc_labe;
    } else {
        altmsg = altmsg + "\n with the outcome of \"" + outc_labe + "\".";
    }

    if (emtype !== emtypes) {
        emtype = emtypes;
    }

    // em_labe is already set correctly based on the input em_labe, so this block is redundant.

    var d = [];
    var b = [];
    if (emtype === "rr" || emtype === "or" || emtype === "rd") {
        for (i = 0; i < k; i++) {
            if (revoreve === "reverse") {
                rco[i] = nco[i] - rco[i];
                rto[i] = nto[i] - rto[i];
            }
            d[i] = nco[i] - rco[i];
            b[i] = nto[i] - rto[i];
        }
    }

    if (emtype === "rr" || emtype === "or") {
        for (i = 0; i < k; i++) {
            if (d[i] === 0 || rco[i] === 0 || b[i] === 0 || rto[i] === 0) {
                nc[i] = 1 * nco[i] + 1;
                rc[i] = 1 * rco[i] + 0.5;
                nt[i] = 1 * nto[i] + 1;
                rt[i] = 1 * rto[i] + 0.5;
            } else {
                nc[i] = nco[i];
                rc[i] = rco[i];
                nt[i] = nto[i];
                rt[i] = rto[i];
            }
        }
    }

    if (emtype === "rd") {
        for (i = 0; i < k; i++) {
            nc[i] = nco[i];
            rc[i] = rco[i];
            nt[i] = nto[i];
            rt[i] = rto[i];
        }
    }

    var es = [];
    var esl = [];
    var lwbd = [];
    var upbd = [];
    var se = [];

    if (emtype === "rr") {
        for (i = 0; i < k; i++) {
            es[i] = (rt[i] / nt[i]) / (rc[i] / nc[i]);
            esl[i] = Math.log(es[i]);
            se[i] = Math.sqrt(1 / rt[i] + 1 / rc[i] - 1 / nt[i] - 1 / nc[i]);
            lwbd[i] = Math.exp(esl[i] - 1.96 * se[i]);
            upbd[i] = Math.exp(esl[i] + 1.96 * se[i]);
        }
    }
    if (emtype === "or") {
        for (i = 0; i < k; i++) {
            es[i] = (rt[i] / (nt[i] - rt[i])) / (rc[i] / (nc[i] - rc[i]));
            esl[i] = Math.log(es[i]);
            se[i] = Math.sqrt(1 / rt[i] + 1 / (nt[i] - rt[i]) + 1 / rc[i] + 1 / (nc[i] - rc[i]));
            lwbd[i] = Math.exp(esl[i] - 1.96 * se[i]);
            upbd[i] = Math.exp(esl[i] + 1.96 * se[i]);
        }
    }

    if (emtype === "rd") {
        for (i = 0; i < k; i++) {
            es[i] = (rt[i] / nt[i]) - (rc[i] / nc[i]);
            se[i] = Math.sqrt(rc[i] * (nc[i] - rc[i]) / (nc[i] * nc[i] * nc[i]) + rt[i] * (nt[i] - rt[i]) / (nt[i] * nt[i] * nt[i]));
            lwbd[i] = es[i] - 1.96 * se[i];
            upbd[i] = es[i] + 1.96 * se[i];
        }
    }

    if (emtype === "md") {
        for (i = 0; i < k; i++) {
            es[i] = mt[i] - mc[i];
            se[i] = Math.sqrt((st[i] * st[i]) / nt[i] + (sc[i] * sc[i]) / nc[i]);
            lwbd[i] = es[i] - 1.96 * se[i];
            upbd[i] = es[i] + 1.96 * se[i];
        }
    }

    var si = [];
    var N;
    if (emtype === "smd") {
        for (i = 0; i < k; i++) {
            N = 1 * nt[i] + 1 * nc[i];
            si[i] = Math.sqrt(((nt[i] - 1) * st[i] * st[i] + (nc[i] - 1) * sc[i] * sc[i]) / (N - 2));
            es[i] = (1 - 3 / (4 * N - 9)) * (mt[i] - mc[i]) / si[i];
            se[i] = Math.sqrt(N / (nt[i] * nc[i]) + (es[i] * es[i]) / (2 * (N - 3.94)));
            lwbd[i] = es[i] - 1.96 * se[i];
            upbd[i] = es[i] + 1.96 * se[i];
        }
    }

    if (emtype === "hr") {
        se = seh;
        for (i = 0; i < k; i++) {
            es[i] = Math.exp(mt[i]);
            lwbd[i] = Math.exp(mt[i] - 1.96 * se[i]);
            upbd[i] = Math.exp(1 * mt[i] + 1.96 * se[i]);
        }
    }

    if ($("#plot_area").css("display") === "block" && $("#funnel_area").css("display") === "block") {
        $("#plot_area").remove();
        $("#funnel_area").remove();
    }

    var linhei = 28;
    var linh = linhei + "px";
    var addh = linhei + 2;

    var w = 924;
    var h = 24 + (k + 6) * linhei;
    var wid = w + 'px';
    var hei = h + 'px';

    var wf = 350;
    var hf = 350;
    var widf = wf + "px";
    var heif = hf + "px";
    var topf = 225 + h;
    var topfp = topf + "px";

    if (document.getElementById("plot_area") === null) {
        $("body").append('<div id=\"plot_area\">' +
            '<canvas id=\"forest\" width=\"' + wid + '\" height=\"' + hei + '\"></canvas>' +
            '</div>');
    }
    if (document.getElementById("funnel_area") === null) {
        $("body").append('<div id=\"funnel_area\">' +
            '<canvas id=\"funnel\" width=\"' + widf + '\" height=\"' + heif + '\"></canvas>' +
            '</div>');
    }

    $("#plot_area").css({ 'display': 'block', 'position': 'absolute', 'top': '220px', 'left': '17px', 'width': wid, 'height': hei, 'border': 'solid 1px silver', 'background-color': '#ffffff' });
    $("#plot_area").draggable();

    $("#forest").css({ 'position': 'absolute', 'top': '0px', 'left': '0px', 'background-color': '#ffffff' });

    $("#funnel_area").css({ 'display': 'block', 'position': 'absolute', 'top': topfp, 'left': '17px', 'width': widf, 'height': heif, 'border': 'solid 1px silver', 'background-color': '#ffffff' });
    $("#funnel_area").draggable();

    $("#funnel").css({ 'position': 'absolute', 'top': '0px', 'left': '0px', 'background-color': '#ffffff' });

    var canvas = document.getElementById("forest");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#000000";

    var fcanvas = document.getElementById("funnel");
    var fctx = fcanvas.getContext("2d");

    fctx.fillStyle = "#ffffff";
    fctx.fillRect(0, 0, wf, hf);
    fctx.fillStyle = "#000000";

    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        ctx.fillText(stid[i], 138, (i + 3) * addh);
    }

    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";
    ctx.fillText(std_labe, 138, 2 * addh);

    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        ctx.fillText(nco[i], 204, (i + 3) * addh);
    }

    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";
    ctx.fillText("N", 204, 2 * addh);
    ctx.textAlign = "left";

    ctx.fillText(cont_labe, 204, 1 * addh);

    ctx.font = "12px Arial";
    ctx.textAlign = "right";

    for (i = 0; i < k; i++) {
        var ichi_val = rco[i];

        if (emtype === "md" || emtype === "smd") {
            ichi_val = mc[i] + " (" + sc[i] + ")";
        }
        if (emtype === "hr") {
            ichi_val = "           ";
        }
        ctx.fillText(ichi_val, 282, (i + 3) * addh);
    }

    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";
    if (emtype === "rr" || emtype === "or" || emtype === "rd") {
        ctx.fillText("Outcome", 282, 2 * addh);
    }
    if (emtype === "md" || emtype === "smd") {
        ctx.fillText("Mean(SD)", 282, 2 * addh);
    }

    ctx.font = "12px Arial bold";
    ctx.textAlign = "left";
    ctx.fillText(inter_labe, 340, 1 * addh);
    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";
    ctx.fillText("N", 340, 2 * addh);

    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        ctx.fillText(nto[i], 340, (i + 3) * addh);
    }

    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";

    if (emtype === "rr" || emtype === "or" || emtype === "rd") {
        ctx.fillText("Outcome", 418, 2 * addh);
    }
    if (emtype === "md" || emtype === "smd") {
        ctx.fillText("Mean(SD)", 418, 2 * addh);
    }
    if (emtype === "hr") {
        ctx.fillText("           ", 418, 2 * addh);
    }

    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        var ichi_val = rto[i];
        if (emtype === "md" || emtype === "smd") {
            ichi_val = mt[i] + " (" + st[i] + ")";
        }
        if (emtype === "hr") {
            ichi_val = "           ";
        }
        ctx.fillText(ichi_val, 418, (i + 3) * addh);
    }

    var wei = [];
    var va = [];
    var lem = [];
    var llwbd = [];
    var lupbd = [];
    var maxse = 0;
    var minse = 0;
    for (i = 0; i < k; i++) {
        if (emtype === "rr" || emtype === "or" || emtype === "hr") {
            lem[i] = Math.log(es[i]);
            llwbd[i] = Math.log(lwbd[i]);
            lupbd[i] = Math.log(upbd[i]);
        }
        if (emtype === "rd" || emtype === "md" || emtype === "smd") {
            lem[i] = es[i];
            llwbd[i] = lwbd[i];
            lupbd[i] = upbd[i];
        }

        se[i] = (lupbd[i] - llwbd[i]) / 2 / 1.96;
        va[i] = Math.pow(se[i], 2);
        wei[i] = 1 / va[i];
        if (maxse < se[i]) {
            maxse = se[i];
        }
        if (minse > se[i]) {
            minse = se[i];
        }
    }

    var sesf = 0;
    var sweif = 0;
    var ssweif = 0;
    for (i = 0; i < k; i++) {
        sesf = sesf + lem[i] * wei[i];
        sweif = sweif + 1 * wei[i];
        ssweif = ssweif + (wei[i] * wei[i]);
    }

    sesf = sesf / sweif;
    var varif = 1 / sweif;
    var llwbdf = sesf - 1.96 * Math.sqrt(1 / sweif);
    var lupbdf = sesf + 1.96 * Math.sqrt(1 / sweif);

    var lwbdf;
    var upbdf;
    var sesfe;
    if (emtype === "rr" || emtype === "or" || emtype === "hr") {
        lwbdf = Math.exp(llwbdf);
        upbdf = Math.exp(lupbdf);
        sesfe = Math.exp(sesf);
    }
    if (emtype === "rd" || emtype === "md" || emtype === "smd") {
        lwbdf = llwbdf;
        upbdf = lupbdf;
        sesfe = sesf;
    }

    var tau2;
    if (dlreml === "reml") {
        tau2 = remltau(lem, va);
    }

    var qu = 0;
    for (i = 0; i < k; i++) {
        qu = qu + (lem[i] - sesf) * (lem[i] - sesf) * wei[i];
    }

    if (dlreml === "dl") {
        tau2 = (qu - (k - 1)) / (sweif - (ssweif / sweif));
    }

    if (tau2 < 0) {
        tau2 = 0;
    }

    var sesr = 0;
    var sweir = 0;
    var vare = [];
    var weir = [];
    for (i = 0; i < k; i++) {
        weir[i] = 1 / (va[i] + tau2);
        vare[i] = va[i];
        sesr = sesr + lem[i] * weir[i];
        sweir = sweir + weir[i];
    }
    sesr = sesr / sweir;

    var ses = Math.sqrt(1 / sweir);
    var llwbdr = sesr - 1.96 * ses;
    var lupbdr = sesr + 1.96 * ses;

    if (emtype === "hr" && revoreve === "reverse") {
        var x;
        var y;
        for (i = 0; i < k; i++) {
            lem[i] = -(lem[i]);
            es[i] = Math.exp(lem[i]);

            x = -(llwbd[i]);
            y = -(lupbd[i]);
            if (x > y) {
                lupbd[i] = x;
                llwbd[i] = y;
                upbd[i] = Math.exp(x);
                lwbd[i] = Math.exp(y);
            } else {
                lupbd[i] = y;
                llwbd[i] = x;
                upbd[i] = Math.exp(y);
                lwbd[i] = Math.exp(x);
            }
        }

        sesr = -(sesr);

        x = -(llwbdr);
        y = -(lupbdr);
        if (x > y) {
            lupbdr = x;
            llwbdr = y;
        } else {
            lupbdr = y;
            llwbdr = x;
        }
    }

    var sesre;
    var lwbdr;
    var upbdr;
    if (emtype === "rr" || emtype === "or" || emtype === "hr") {
        sesre = Math.exp(sesr);
        lwbdr = Math.exp(llwbdr);
        upbdr = Math.exp(lupbdr);
    }
    if (emtype === "rd" || emtype === "md" || emtype === "smd") {
        sesre = sesr;
        lwbdr = llwbdr;
        upbdr = lupbdr;
    }

    var perweir = [];
    var boxsizer = [];
    for (i = 0; i < k; i++) {
        perweir[i] = 100 * weir[i] / sweir;
        boxsizer[i] = Math.sqrt(perweir[i]);
    }

    var z = Math.abs(sesr / ses);
    var zlabe = "=" + Math.round(sesr * 100 / ses) / 100;
    var p = 1 - jStat.normal.cdf(z, 0, 1);
    p = p * 2;
    var plabe;
    if (p <= 0.000001) {
        plabe = "<0.000001";
    } else {
        plabe = "=" + Math.round(p * 1000000) / 1000000;
    }

    var svm = (k - 1) * sweif / (sweif * sweif - ssweif);
    var i2 = 100 * tau2 / (tau2 + svm);

    i2 = Math.round(10 * i2) / 10;
    if (i2 < 0) {
        i2 = 0;
    }

    var qp = 1 - jStat.chisquare.cdf(qu, k - 1);
    var qplabe;
    if (qp <= 0.001) {
        qplabe = "<0.001";
    } else {
        qplabe = "=" + Math.round(qp * 10000) / 10000;
    }

    var qulabe = Math.round(qu * 10) / 10;
    var tau2labe = Math.round(tau2 * 10000) / 10000;

    function kendallsTau(xo, y, fes, fva) {
        let n = xo.length;
        let numConcordant = 0;
        let numDiscordant = 0;
        let xties = 0;
        let yties = 0;
        var x = [];

        for (let i = 0; i < n; i++) {
            x[i] = (xo[i] - fes) / Math.sqrt(y[i] - fva);
        }

        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                let signX = x[i] - x[j];
                let signY = y[i] - y[j];
                if (signX * signY > 0) {
                    numConcordant++;
                } else {
                    numDiscordant++;
                }
                if (signX === 0) {
                    xties++;
                }
                if (signY === 0) {
                    yties++;
                }
            }
        }
        let tau = (numConcordant - numDiscordant) / Math.sqrt((numConcordant + numDiscordant + xties) * (numConcordant + numDiscordant + yties));
        let z = (numConcordant - numDiscordant) / Math.sqrt(n * (n - 1) * (2 * n + 5) / 18);
        var p = 1 - jStat.normal.cdf(Math.abs(z), 0, 1.0);
        p = p * 2;

        if (n < 50 && xties === 0 && yties === 0) {
            p = approximatePValue(x, y);
        }

        if (p <= 0.01) {
            var plabe_k = "<0.01";
        } else {
            var plabe_k = Math.round(p * 100) / 100;
        }
        z = Math.round(z * 100) / 100;
        tau = Math.round(tau * 100) / 100;
        return { tau, z, plabe: plabe_k };
    }

    function kenTau(dataX, dataY) {
        let concordant = 0;
        let discordant = 0;

        for (let i = 0; i < dataX.length; i++) {
            for (let j = i + 1; j < dataX.length; j++) {
                const rankDiffX = dataX[i] - dataX[j];
                const rankDiffY = dataY[i] - dataY[j];

                if (rankDiffX * rankDiffY > 0) {
                    concordant++;
                } else if (rankDiffX * rankDiffY < 0) {
                    discordant++;
                }
            }
        }
        const tau = (concordant - discordant) / (concordant + discordant);
        return tau;
    }

    function approximatePValue(dataX, dataY, numSamples = 100000) {
        const observedTau = kenTau(dataX, dataY);
        let extremeCount = 0;

        for (let i = 0; i < numSamples; i++) {
            const perm = dataY.slice().sort(() => Math.random() - 0.5);
            const permTau = kenTau(dataX, perm);
            if (Math.abs(permTau) >= Math.abs(observedTau)) {
                extremeCount++;
            }
        }
        return extremeCount / numSamples;
    }

    var egger;
    var begg;
    if (emtype === "md" || emtype === "smd") {
        egger = linear_reg_w(se, es, va);
        begg = kendallsTau(es, va, sesf, varif);
    }
    if (emtype === "hr" || emtype === "rr" || emtype === "or" || emtype === "rd") {
        egger = linear_reg_w(se, lem, va);
        begg = kendallsTau(lem, va, sesf, varif);
    }

    var res;
    if (emtype === "rr" || emtype === "or" || emtype === "rd") {
        res = "Study Id\tnc\trc\tnt\trt\t" + em_labe + "\tLower\tUpper\t%Weight\tyi\tvi\n";
        for (i = 0; i < k; i++) {
            res = res + stid[i] + "\t" + nco[i] + "\t" + rco[i] + "\t" + nto[i] + "\t" + rto[i] + "\t" + decimal_adj(es[i]) + "\t" + decimal_adj(lwbd[i]) + "\t" + decimal_adj(upbd[i]) + "\t" + decimal_adjp(perweir[i]) + "\t" + lem[i] + "\t" + va[i] + "\n";
        }
        res = res + "Summary\t" + "Z=\t" + zlabe + "\tp=\t" + plabe + "\t" + sesre + "\t" + lwbdr + "\t" + upbdr + "\n";
        res = res + "I2=\t" + i2 + "\tQ=\t" + qulabe + "\t" + "p=\t" + qplabe + "\t" + "tau2=" + "\t" + tau2labe + "\n";
        res = res + "Outcome:\t" + outc_labe + "\tFE\tbeta\t" + sesf + "\tvb\t" + varif;
    }
    if (emtype === "md" || emtype === "smd") {
        res = "Study Id\tn2i\tm2i\tsd2i\tn1i\tm1i\tsd2i\t" + em_labe + "\tLower\tUpper\t%Weight\tyi\tvi\n";
        for (i = 0; i < k; i++) {
            res = res + stid[i] + "\t" + nc[i] + "\t" + mc[i] + "\t" + sc[i] + "\t" + nt[i] + "\t" + mt[i] + "\t" + st[i] + "\t" + decimal_adj(es[i]) + "\t" + decimal_adj(lwbd[i]) + "\t" + decimal_adj(upbd[i]) + "\t" + decimal_adjp(perweir[i]) + "\t" + es[i] + "\t" + va[i] + "\n";
        }
        res = res + "\t\t\Summary\t" + "Z=\t" + zlabe + "\tp=\t" + plabe + "\t" + sesre + "\t" + lwbdr + "\t" + upbdr + "\n";
        res = res + "I2=\t" + i2 + "\tQ=\t" + qulabe + "\t" + "p=\t" + qplabe + "\t" + "tau2=" + "\t" + tau2labe + "\n";
        res = res + "Outcome:\t" + outc_labe + "\tFE\tbeta\t" + sesf + "\tvb\t" + varif;
    }
    if (emtype === "hr") {
        res = "Study Id\tnt\tnc\tyi\tsei\t" + em_labe + "\tLower\tUpper\t%Weight\tyi\tvi\n";
        for (i = 0; i < k; i++) {
            res = res + stid[i] + "\t" + nt[i] + "\t" + nc[i] + "\t" + mt[i] + "\t" + se[i] + "\t" + decimal_adj(es[i]) + "\t" + decimal_adj(lwbd[i]) + "\t" + decimal_adj(upbd[i]) + "\t" + decimal_adjp(perweir[i]) + "\t" + lem[i] + "\t" + va[i] + "\n";
        }
        res = res + "Summary\t" + "Z=\t" + zlabe + "\tP=\t" + plabe + "\t" + sesre + "\t" + lwbdr + "\t" + upbdr + "\n";
        res = res + "I2=\t" + i2 + "\tQ=\t" + qulabe + "\t" + "p=\t" + qplabe + "\t" + "tau2=" + "\t" + tau2labe + "\n";
        res = res + "Outcome:\t" + outc_labe + "\tFE\tbeta\t" + sesf + "\tvb\t" + varif;
    }
    res = res + "\n" + "Egger's test" + "\t" + "slope=" + "\t" + egger[0] + "\t" + "t-statistic=" + "\t" + egger[1] + "\t" + "p=" + "\t" + egger[2] + "\n";
    res = res + "Begg & Mazumdar test" + "\t" + "Kendall's tau=" + "\t" + begg.tau + "\t" + "z-statistic=" + "\t" + begg.z + "\t" + "P=" + "\t" + begg.plabe + "\n";
    //document.getElementById("metaresult").value = res;

    var maxlup = 1 * lupbd[0];
    var minllw = 1 * llwbd[0];
    for (i = 0; i < k; i++) {
        if (lupbd[i] > maxlup) {
            maxlup = lupbd[i];
        }
    }
    for (i = 0; i < k; i++) {
        if (1 * llwbd[i] < 1 * minllw) {
            minllw = llwbd[i];
        }
    }

    if (minllw < 0 && maxlup < 0) {
        maxlup = 0;
    }
    if (minllw > 0 && maxlup > 0) {
        minllw = 0;
    }

    var rang = maxlup - minllw;
    var per = 2.5;
    var eml = [];
    var emlf = [];
    var lwbdl = [];
    var upbdl = [];
    var ady = 424;
    for (i = 0; i < k; i++) {
        eml[i] = 1 * ady + 100 * per * (lem[i] - minllw) / rang;
        lwbdl[i] = 1 * ady + 100 * per * (llwbd[i] - minllw) / rang;
        upbdl[i] = 1 * ady + 100 * per * (lupbd[i] - minllw) / rang;
        emlf[i] = 100 * per * (lem[i] - minllw) / rang;
    }

    var cbdes = [];
    var cbdlw = [];
    var cbdup = [];
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        var ichi_val = es[i];
        ctx.fillText(decimal_adj(ichi_val), 735, (i + 3) * addh);
        cbdes[i] = decimal_adj(ichi_val);
    }
    for (i = 0; i < k; i++) {
        var ichi_val = lwbd[i];
        ctx.fillText(decimal_adj(ichi_val), 785, (i + 3) * addh);
        cbdlw[i] = decimal_adj(ichi_val);
    }

    for (i = 0; i < k; i++) {
        var ichi_val = upbd[i];
        ctx.fillText(decimal_adj(ichi_val), 835, (i + 3) * addh);
        cbdup[i] = decimal_adj(ichi_val);
    }

    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    var ichi_str = "Z" + zlabe;
    ctx.fillText(ichi_str, 735, (k + 4) * addh);
    ichi_str = "p" + plabe;
    ctx.fillText(ichi_str, 835, (k + 4) * addh);

    ctx.font = "12px Arial bold";
    ctx.textAlign = "right";
    ctx.fillText(em_labe, 735, 2 * addh);
    ichi_str = decimal_adj(sesre);
    ctx.fillText(ichi_str, 735, (k + 3) * addh);
    cbdes[k] = ichi_str;

    ctx.fillText("95% CI", 820, 1 * addh);
    ctx.fillText("Lower", 785, 2 * addh);
    ichi_str = decimal_adj(lwbdr);
    ctx.fillText(ichi_str, 785, (k + 3) * addh);
    cbdlw[k] = ichi_str;

    ctx.fillText("Upper", 835, 2 * addh);
    ichi_str = decimal_adj(upbdr);
    ctx.fillText(ichi_str, 835, (k + 3) * addh);
    ctx.fillText("%Weight", 900, 2 * addh);
    cbdup[k] = ichi_str;

    ichi_str = 100;
    ctx.fillText(ichi_str, 900, (k + 3) * addh);

    ctx.fillText("Summary", 138, (k + 3) * addh);
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("I = " + i2 + "%", 138, (k + 4) * addh);
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("2", 141, (k + 4) * addh - 8);
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("tau = " + tau2labe, 204, (k + 4) * addh);
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("2", 220, (k + 4) * addh - 8);

    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Q=" + qulabe + " p" + qplabe, 280, (k + 4) * addh);

    var cbd_dat = "";
    for (i = 0; i < k + 1; i++) {
        cbd_dat = cbd_dat + cbdes[i] + "\t" + cbdlw[i] + "～" + cbdup[i] + "\n";
    }
    navigator.clipboard.writeText(cbd_dat);

    ctx.fillStyle = "#000000";
    ctx.lineWidth = 0.3;
    var y = 88;
    for (i = 0; i < k; i++) {
        ctx.moveTo(lwbdl[i], y + i * addh);
        ctx.lineTo(upbdl[i], y + i * addh);
        ctx.stroke();
    }

    y = 88;
    for (i = 0; i < k; i++) {
        ctx.fillRect(eml[i] - boxsizer[i], y + i * addh - boxsizer[i], boxsizer[i] * 2, boxsizer[i] * 2);
    }

    ctx.textAlign = "right";
    for (i = 0; i < k; i++) {
        ichi_str = decimal_adjp(perweir[i]);
        ctx.fillText(ichi_str, 900, (i + 3) * addh);
    }

    var sesrl = 1 * ady + 100 * per * (sesr - minllw) / rang;
    var llwbdrl = 1 * ady + 100 * per * (llwbdr - minllw) / rang;
    var lupbdr = 1 * ady + 100 * per * (lupbdr - minllw) / rang;

    i = k;
    var he = 7;
    ctx.lineWidth = 0.4;
    ctx.moveTo(llwbdrl, y + i * addh);
    ctx.lineTo(sesrl, y + i * addh - he);
    ctx.stroke();
    ctx.moveTo(sesrl, y + i * addh - he);
    ctx.lineTo(lupbdr, y + i * addh);
    ctx.stroke();
    ctx.moveTo(lupbdr, y + i * addh);
    ctx.lineTo(sesrl, y + i * addh + he);
    ctx.stroke();
    ctx.moveTo(sesrl, y + i * addh + he);
    ctx.lineTo(llwbdrl, y + i * addh);
    ctx.stroke();

    i = k + 1;
    ctx.lineWidth = 0.2;
    ctx.moveTo(1 * ady + 0, y + i * addh);
    ctx.lineTo(1 * ady + 250, y + i * addh);
    ctx.stroke();

    ctx.lineWidth = 0.2;
    ctx.moveTo(1 * ady + 100 * (0 - minllw) * per / rang, y + i * addh + 4);
    ctx.lineTo(1 * ady + 100 * (0 - minllw) * per / rang, y - addh + 10);
    ctx.stroke();

    var j = 1;
    var tic = rang / 8;

    if (emtype === "rr" || emtype === "or" || emtype === "hr") {
        for (j = 1; j < 8; j++) {
            var ticn = Math.exp(1 * minllw + 1 * tic * j);
            var ticl = Math.floor(10 * ticn) / 10;
            if (ticn < 0.1) {
                ticl = Math.floor(100 * ticn) / 100;
            }
            if (ticn < 0.01) {
                ticl = Math.floor(1000 * ticn) / 1000;
            }
            if (ticl > 100) {
                ticl = Math.floor(Math.exp(1 * minllw + 1 * tic * j));
            }
            var xtic = 1 * ady + 100 * 2.5 * (Math.log(ticl) - minllw) / rang;
            ctx.moveTo(xtic, y + i * addh);
            ctx.lineTo(xtic, y + i * addh + 4);
            ctx.stroke();
            ctx.font = "11px Arial";
            ctx.textAlign = "center";
            ctx.fillText(ticl, xtic, y + i * addh + 15);
        }
    }

    if (emtype === "rd" || emtype === "md" || emtype === "smd") {
        for (j = 1; j < 8; j++) {
            var ticn = 1 * minllw + 1 * tic * j;
            var ticl = Math.floor(10 * ticn) / 10;
            if (Math.abs(ticn) < 0.1) {
                ticl = Math.floor(100 * ticn) / 100;
            }
            if (Math.abs(ticn) < 0.01) {
                ticl = Math.floor(1000 * ticn) / 1000;
            }
            if (Math.abs(ticl) > 100) {
                ticl = Math.floor(1 * minllw + 1 * tic * j);
            }
            var xtic = 1 * ady + 100 * 2.5 * (ticl - minllw) / rang;
            if (xtic >= ady) {
                ctx.moveTo(xtic, y + i * addh);
                ctx.lineTo(xtic, y + i * addh + 4);
                ctx.stroke();
                ctx.font = "11px Arial";
                ctx.textAlign = "center";
                ctx.fillText(ticl, xtic, y + i * addh + 15);
            }
        }
    }
    var adv = 31;
    var labout = "Outcome: " + outc_labe;
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(labout, 1 * ady - 120, adv + (k + 5) * linhei);
    ctx.fillText("IV", 735, adv + (k + 5) * linhei);
    var dlremllabe;
    if (dlreml === "reml") {
        dlremllabe = "REML";
    } else {
        dlremllabe = "DL";
    }
    ctx.fillText(dlremllabe, 835, adv + (k + 5) * linhei);

    var fore = document.getElementById("forest");
    var forest_img = fore.toDataURL();
    $("#forest").remove();
    $("#plot_area").append('<img id=\"forest_plot\">');
    document.getElementById("forest_plot").src = forest_img;

    var fsel = [];
    for (i = 0; i < k; i++) {
        fsel[i] = 100 * se[i] / (maxse * 1.05);
    }

    var heikin = 50 + 100 * per * (sesr - minllw) / rang;
    var xfad = 50 + 125 - heikin;

    fctx.lineWidth = 1;
    fctx.strokeStyle = "silver";
    fctx.moveTo(175, 25);
    fctx.lineTo(175, 275);
    fctx.stroke();

    var xr = 50 + 1 * xfad + 100 * per * (sesr + 1.96 * maxse - minllw) / rang;
    var xl = 50 + 1 * xfad + 100 * per * (sesr - 1.96 * maxse - minllw) / rang;

    fctx.lineWidth = 1;
    fctx.fillStyle = "silver";
    fctx.moveTo(xl, 275);
    fctx.lineTo(175, 25);
    fctx.stroke();
    fctx.moveTo(xr, 275);
    fctx.lineTo(175, 25);
    fctx.stroke();

    var ens = 3;
    fctx.fillStyle = "#000000";
    fctx.strokeStyle = "#000000";
    for (i = 0; i < k; i++) {
        var yf = 25 + per * fsel[i];
        var xf = 1 * emlf[i] + 50 + 1 * xfad;

        fctx.beginPath();
        fctx.arc(xf, yf, ens, 0, 2 * Math.PI);
        fctx.stroke();
    }

    fctx.fillStyle = "#000000";
    fctx.lineWidth = 1;
    fctx.moveTo(50, 275);
    fctx.lineTo(300, 275);
    fctx.stroke();

    j = 1;
    tic = rang / 8;

    if (emtype === "rr" || emtype === "or" || emtype === "hr") {
        for (j = 1; j < 10; j++) {
            var ticn = Math.exp(1 * minllw + 1 * tic * j);
            var ticl = Math.floor(10 * ticn) / 10;
            if (ticn < 0.1) {
                ticl = Math.floor(100 * ticn) / 100;
            }
            if (ticn < 0.01) {
                ticl = Math.floor(1000 * ticn) / 1000;
            }
            if (ticl > 100) {
                ticl = Math.floor(Math.exp(1 * minllw + 1 * tic * j));
            }

            var xtic = xfad + 50 + 100 * 2.5 * (Math.log(ticl) - minllw) / rang;
            if (xtic > 50 && xtic < 300) {
                fctx.moveTo(xtic, 275);
                fctx.lineTo(xtic, 275 + 4);
                fctx.stroke();
                fctx.font = "11px Arial";
                fctx.textAlign = "center";
                fctx.fillText(ticl, xtic, 275 + 15);
            }
        }
    }

    if (emtype === "rd" || emtype === "md" || emtype === "smd") {
        for (j = 1; j < 8; j++) {
            var ticn = 1 * minllw + 1 * tic * j;
            var ticl = Math.floor(10 * ticn) / 10;
            if (Math.abs(ticn) < 0.1) {
                ticl = Math.floor(100 * ticn) / 100;
            }
            if (Math.abs(ticn) < 0.01) {
                ticl = Math.floor(1000 * ticn) / 1000;
            }
            if (Math.abs(ticl) > 100) {
                ticl = Math.floor(1 * minllw + 1 * tic * j);
            }
            var xtic = xfad + 50 + 100 * 2.5 * (ticl - minllw) / rang;
            if (xtic > 50 && xtic < 300) {
                fctx.moveTo(xtic, 275);
                fctx.lineTo(xtic, 275 + 4);
                fctx.stroke();
                fctx.font = "11px Arial";
                fctx.textAlign = "center";
                fctx.fillText(ticl, xtic, 275 + 15);
            }
        }
    }

    fctx.lineWidth = 1;
    fctx.moveTo(50, 25);
    fctx.lineTo(50, 275);
    fctx.stroke();

    var ytic = (maxse * 1.05) / 5;
    var yval = [];
    for (i = 0; i < 5; i++) {
        yval[i] = (i + 1) * ytic;
    }

    for (j = 0; j < 5; j++) {
        var ticn = yval[j];
        var ticl = Math.floor(10 * ticn) / 10;
        if (Math.abs(ticn) < 1) {
            ticl = Math.floor(100 * ticn) / 100;
        }
        if (Math.abs(ticn) < 0.01) {
            ticl = Math.floor(1000 * ticn) / 1000;
        }
        if (Math.abs(ticl) > 100) {
            ticl = Math.floor(1 * minllw + 1 * tic * j);
        }

        var ypos = 25 + 2.5 * 100 * ticl / (maxse * 1.05);

        fctx.moveTo(50, ypos);
        fctx.lineTo(50 - 4, ypos);
        fctx.stroke();
        fctx.font = "11px Arial";
        fctx.textAlign = "center";
        fctx.fillText(ticl, 35, ypos + 4);
    }
    fctx.moveTo(50, 25);
    fctx.lineTo(50 - 4, 25);
    fctx.stroke();
    fctx.textAlign = "center";
    fctx.fillText("SE", 30, 15);
    fctx.fillText("0", 42, 30);
    fctx.fillText(em_labe, 318, 290);

    var egp = egger[2];
    var eglabe;
    if (egp <= 0.01) {
        eglabe = "<0.01";
    } else {
        eglabe = "=" + Math.round(egp * 100) / 100;
    }
    var egger1 = "Egger's test";
    var egger2 = "p" + eglabe;
    fctx.textAlign = "left";
    fctx.fillText(egger1, 248, 40);
    fctx.fillText(egger2, 265, 54);
    var begg1 = "Begg's test";
    var begg2 = "Kendall's tau=" + begg.tau;
    var begg3 = "Z=" + begg.z;
    var begg4 = "p=" + begg.plabe;
    fctx.fillText(begg1, 248, 68);
    fctx.fillText(begg4, 265, 82);

    var funne = document.getElementById("funnel");
    var funnel_img = funne.toDataURL();
    $("#funnel").remove();
    $("#funnel_area").append('<img id=\"funnel_plot\">');
    document.getElementById("funnel_plot").src = funnel_img;
}
///----------------------------------
///----------------------------------
function remltau(effectSizes, variances) {
    const maxIterations = 10000;
    const tolerance = 1e-6;
    let k = effectSizes.length;
    let tauSquared = 0; // Initial guess for τ²
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let oldTauSquared = tauSquared;
        // Calculate weights based on current τ²
        let weights = variances.map(v => 1 / (v + tauSquared));
        // Weighted mean effect size
        let weightedMean = effectSizes.reduce((sum, y, i) => sum + weights[i] * y, 0) / weights.reduce((sum, w) => sum + w, 0);
        // Update τ² estimation. weights includes tau-added weights.
        let sumW = weights.reduce((sum, w) => sum + w, 0);
        let residuals = effectSizes.map((y, i) => y - weightedMean);
        let sumWiSquared = weights.reduce((sum, w) => sum + w * w, 0);
        //let tauSquaredNumerator = residuals.reduce((sum, r, i) => sum + weights[i] * r * r, 0) - (k - 1);
        //tauSquared = tauSquaredNumerator / (sumW - (sumWiSquared / sumW));
		let tauSquaredNumerator = residuals.reduce((sum, r, i) => sum + weights[i]*weights[i] * (r * r - variances[i]), 0);
        tauSquared = tauSquaredNumerator / sumWiSquared + 1/ sumW;
        // Check for convergence
        if (Math.abs(tauSquared - oldTauSquared) < tolerance) {
            break;
        }
    }
    return tauSquared;
}
///----------------------------------------
///----------------------------------------
function decimal_adj(ichi)	//For effect measure values;
{
	var ichi;
	//Cut the length.
	if(ichi<10){
	ichi=Math.round(ichi*1000)/1000;
	}
	if(ichi>=10){
	ichi=Math.round(ichi*10)/10;
	}
//Add 0 after the digit.
	if(ichi<10&&String(ichi).length==4){
		ichi=ichi+"0";
	}
	if(ichi<10&&String(ichi).length==3){
		ichi=ichi+"00";
	}
	if((String(ichi).split(".").length)==1)
	{		
		ichi=ichi+".0";
	}
	
	
	return ichi;
}
///----------------------------------------
///----------------------------------------
function decimal_adjp(ichi)	//For percent values of weight.
{
	var ichi;
	//Cut the length to one digit under decimal.
	ichi=Math.round(ichi*10)/10;
	
//Add 0 after the digit.
	if((String(ichi).split(".").length)==1)
	{		
		ichi=ichi+".0";
	}
	
	
	return ichi;
}
///------------------------------------------
///------------------------------------------
///Scripts for Egger's test------------------
function trans_mx(m){
	//Transpose the matrix:
xr=m.length;	//The number of rows of matrix X.
xc=m[0].length;	//The number of columns of matrix X.
R=new Array(xc);	//Make a transpose of X. 
for(i=0;i<xc;i++){
	R[i]=new Array(xr);
	for(j=0;j<xr;j++){
	R[i][j]=m[j][i];
	}
}
return R;
}
///------------------------------------------
function inverse_2(t){
//Make inverse matrix tt from t (2 x2).
var xr=t.length;
var xc=t[0].length;
tt=new Array(xc);	//Make a 2x2 matrix for inverse of t.
for(j=0;j<xc;j++){
tt[j]=new Array(xr);
for(i=0;i<xc;i++){
	tt[j][i]=0;
}
}
var or=t[0][0]*t[1][1]-t[1][0]*t[0][1];
tt[0][0]=t[1][1];
tt[1][1]=t[0][0];
tt[1][0]=-t[0][1];
tt[0][1]=-t[1][0];
for(i=0;i<xr;i++){
	for(j=0;j<xr;j++){
		tt[i][j]=tt[i][j]/or;
	}
}
return tt;
}
///-------------------------------------------
function multip_mx(XX,YY){
//Multiplication of matrices XX and YY:
var xr=XX.length;
var xc=XX[0].length;
var yr=YY.length;
var yc=YY[0].length;
//Make matrix R (xr x yc) for the results.
R=new Array(xr);	//Make xr rows yc colums matrix to store matrix multiplication, Xt%*%X
for(j=0;j<xr;j++){
R[j]=new Array(yc);
for(i=0;i<yc;i++){
	R[j][i]=0;
}
}

for(i=0;i<xr;i++){	
for(j=0;j<yc;j++){
var z=0;
for(k=0;k<xc;k++){
z=z+XX[i][k]*YY[k][j];
}
R[i][j]=z;
}
}
return R;	
}
///------------------------------------------
function linear_reg_w(se,es,va){
//var x=[21,20,19,18,17,16,15];
var xc=se.length;
X=new Array(xc);	//Make a matrix X (xc x 2) from x with ones in column 0 and x in column 1.
for(i=0;i<xc;i++){	//Use i for row, j for column in the following scripts.
	X[i]=new Array(2);
	X[i][0]=1;	//Column 1 holds 1.
	X[i][1]=se[i]	//Column 2 holds se.
}

var Xt=trans_mx(X);	//Transpose X to Xt.

//var y=[17.26,17.07,16.37,16.40,16.13,16.17,15.98];
var yc=es.length;
Y=new Array(yc);
for(i=0;i<yc;i++){
Y[i]=new Array(1);	
Y[i][0]=es[i];
}

//A matrix of weights W (wc x wc) with weight values diagonal.
//var wm=[20,26,27,24,36,39,32];
var wc=va.length;
W=new Array(wc);
for(i=0;i<wc;i++){
	W[i]=new Array(wc);
	for(j=0;j<wc;j++){
		W[i][j]=0; 
	}
}
for(i=0;i<wc;i++){
	W[i][i]=1/va[i];	//1/variance
	//W[i][i]=wm[i];
}

////Matrix calculations////
var Xw=multip_mx(Xt,W);
var t=multip_mx(Xw,X);

//Make inverse matrix tt from t.

var tt=inverse_2(t);
////
t=multip_mx(tt,Xt);
////OK down here.
var tw=multip_mx(t,W);

///////////
var betaw=multip_mx(tw,Y);

betawt=trans_mx(betaw);
var Yhat=multip_mx(betawt,Xt);

var yc=es.length;
E=new Array(1);
E[0]=new Array(yc);
for(i=0;i<yc;i++){	
E[0][i]=Y[i][0]-Yhat[0][i];
}

var Yt=trans_mx(Y);
var SSres1=multip_mx(Yt,W);
var SSres2=multip_mx(SSres1,Y);
var SSres3=multip_mx(Yhat,W);
var SSres4=multip_mx(SSres3,Y);
var SSres=SSres2-SSres4;

var n=yc;
var k=1;
var dfres=n-k-1;
var MSres=SSres/dfres;

ones=new Array(yc);
for(i=0;i<yc;i++){	
ones[i]=new Array(1);
ones[i][0]=1;
}

var SST1=multip_mx(trans_mx(Y),W);
var SST2=multip_mx(SST1,Y);
var SST3=multip_mx(trans_mx(ones),W);
var SST4=multip_mx(SST3,Y);
var SST5=multip_mx(SST3,ones);
var SST=SST2-SST4*SST4/SST5;

var SSreg=SST-SSres;

var dfT=n-1;
var dfreg=k;
//var dfres=n-k-1;
var MST=SST/dfT;
var MSreg=SSreg/dfreg;
//var MSres=SSres/dfres;
var F_score=MSreg/MSres;
var p_anova=jStat.ftest(F_score,k,dfres);

//Coefficients in matrix:
var covm1=multip_mx(multip_mx(Xt,W),X);
var covm2=inverse_2(covm1);
var covm=covm2;
for(i=0;i<2;i++){
for(j=0;j<2;j++){
covm[i][j]=covm2[i][j]*MSres;
}	
}

//Intercept and slope:
var intercept=betaw[0][0];
var slope=betaw[1][0];

var interceptSE=Math.sqrt(covm[0][0]);
var t_inter=betaw[0][0]/interceptSE;
var p_inter=1-jStat.studentt.cdf(Math.abs(t_inter),dfres);
p_inter=p_inter*2;

var slopeSE=Math.sqrt(covm[1][1]);
var t_slope=betaw[1][0]/slopeSE;
var p_slope=1-jStat.studentt.cdf(Math.abs(t_slope),dfres);
p_slope=p_slope*2;

//Overall fit:
var R_sqr=SSreg/SST;
var Multi_R=Math.sqrt(R_sqr);
var Adj_R_square=1-(1-R_sqr)*n/dfT;
var SE_all=Math.sqrt(MSres);

var egger=new Array(6);
egger[0]=slope;
egger[1]=t_slope;
egger[2]=p_slope;
egger[3]=intercept;
egger[4]=t_inter;
egger[5]=p_inter;
return egger;
}
///------------------------------------------
///------------------------------------------
