const DELAYMS = 1000 * 3;
const CHANCE = 0.65;
const DELAYADDERROR = 1000;
const CONSTPART = 1000;

let jobCount = {};
jobCount.num = 0;
jobCount.listeners = [];
jobCount.set = (n) => {
    jobCount.num = n;
    jobCount.listeners.forEach(element => {
        element(n);
    });
};
jobCount.get = () => {
    return jobCount.num;
};
jobCount.addEvent = (func) => {
    jobCount.listeners.push(func);
};
jobCount.inc = () => {
    jobCount.set(++jobCount.num);
};
jobCount.dec = () => {
    jobCount.set(--jobCount.num);
};

let pcount = 0;

let counter = document.getElementById("num");
let plural = document.getElementById("plur");
let meter = document.getElementById("meter-num");

jobCount.addEvent(n => counter.innerText = n);
jobCount.addEvent(n => plural.style.display = n > 1 ? "inline" : "none");
jobCount.addEvent(n => meter.style.height = `${n*10 > 100 ? 100 : n*10}%`);
jobCount.set(0);

const makeNewPromise = () => {
    let thiscount = ++pcount;

    jobCount.inc();
    const log = document.getElementById('log');
    let item = newTableEmpty();
    item.id = thiscount;
    log.appendChild(item);

    const syncItem = newRow();
    const asyncItem = newRow();
    item.appendChild(syncItem.row);
    item.appendChild(asyncItem.row);
    syncItem.id.innerText = thiscount;
    syncItem.id.rowSpan = 2;
    syncItem.job.innerText = "Sync job state";
    syncItem.run.innerText = "RUN";

    let pr1 = new Promise((res, rej) => {
        let decision = Math.random();
        asyncItem.id.style.display = "none";
        asyncItem.job.innerText = "Async job state";
        asyncItem.run.innerText = "RUN";
        if (decision <= CHANCE) setTimeout(() => res(), Math.random() * DELAYMS + CONSTPART);
        if (decision > CHANCE) setTimeout(() => rej(), Math.random() * DELAYMS + DELAYADDERROR + CONSTPART);
    });

    let sp1 = document.createElement('span');
    sp1.className = 'suc';
    sp1.innerHTML = 'SUCCESS';

    let sp2 = document.createElement('span');
    sp2.className = 'err';
    sp2.innerHTML = 'FAILURE';
    sp2.onclick = () => info(sp2, item.remove.bind(item));

    pr1
        .then(res => {
            asyncItem.end.appendChild(sp1);
            jobCount.dec();
            setTimeout(() => item.remove(), Math.random() * DELAYMS + CONSTPART)
        })
        .catch(err => {
            asyncItem.end.appendChild(sp2);
            jobCount.dec();
        })
    syncItem.end.innerText = "END";
};

const info = (e, remove) => {
    e.innerHTML = "PENDING";
    e.className = "pen";
    let n = Math.random();
    setTimeout((n) => {
        if (n > CHANCE) {
            e.innerHTML = "SUCCESS";
            e.className = "suc";
            setTimeout(() => remove(), Math.random() * DELAYMS + CONSTPART);
        } else {
            e.innerHTML = "FAILURE";
            e.className = "err";
        }
    }, Math.random() * DELAYMS + CONSTPART, n);
}

document.getElementById("btn-new").addEventListener("click", makeNewPromise);

const newTableEmpty = () => {
    const table = document.createElement("table");
    table.className = "table-main";
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    return table;
}

const newTableSingle = () => {
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.textAlign = "center";
    const tbody = document.createElement("tbody");
    const trow = document.createElement("tr");
    trow.className = "trow";
    const idNum = document.createElement("td");
    const jobType = document.createElement("td");
    const isRun = document.createElement("td");
    const isEnd = document.createElement("td");

    trow.appendChild(idNum);
    trow.appendChild(jobType);
    trow.appendChild(isRun);
    trow.appendChild(isEnd);

    tbody.appendChild(trow);

    table.appendChild(tbody);
    return {
        table: table,
        cells: {
            id: idNum,
            job: jobType,
            run: isRun,
            end: isEnd,
        },
    };
};

const newRow = () => {
    const trow = document.createElement("tr");
    trow.className = "trow";
    const idNum = document.createElement("td");
    const jobType = document.createElement("td");
    const isRun = document.createElement("td");
    const isEnd = document.createElement("td");

    trow.appendChild(idNum);
    trow.appendChild(jobType);
    trow.appendChild(isRun);
    trow.appendChild(isEnd);

    return {
        row: trow,
        id: idNum,
        job: jobType,
        run: isRun,
        end: isEnd,
    };
}