const cluster = require("cluster");
const express = require("express");
const os = require("os");
const app = require("./app");


const clusterWorkerSize = os.cpus().length;

cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {
    for (let i=0; i < clusterWorkerSize; i++) {
        cluster.fork();
    }
}
else {
    app(cluster);
}
