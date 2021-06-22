import type { RequestHandler } from 'express';
import moment from 'moment';
// get latest client data
import { updated, clients } from './dummyData/onlinePOSClients.js';
// get complete list from db
import completeList from './dummyData/completePOSListByState.js';

const POSUnits: RequestHandler = (_req, res) => {
  const clientNames = clients.map((x) => x.name);

  // add online status to db list
  const POSUnits = completeList.map((unit) => {
    const idx = clientNames.indexOf(unit.name);

    const active = idx > -1;
    let uptime;
    if (active) {
      const ms = moment(updated).diff(moment(clients[idx].connected_since));
      const d = moment.duration(ms);
      uptime = d.humanize();
    }

    return {
      ...unit,
      active,
      uptime,
    };
  });

  // filter out clients without a name
  const onlineClients = POSUnits.filter((x) => x.name);

  res.json(onlineClients);
};

const locationData: RequestHandler = (_req, res) => {
  res.json(require('./dummyData/dummylocations.js'));
};

const headquarterData: RequestHandler = (_req, res) => {
  res.json(
    new Array(6).fill(0).map(require('./dummyData/randomValues/barBySate.js'))
  );
};

const industryData: RequestHandler = (_req, res) => {
  const monthly = require('./dummyData/randomValues/monthlyData.js');
  const data = require('./dummyData/randomValues/barBySate.js');

  res.json(new Array(2).fill(0).map(() => monthly(data)));
};

const digitalData: RequestHandler = (_req, res) => {
  const monthly = require('./dummyData/randomValues/monthlyData.js');
  const randomBarData = require('./dummyData/randomValues/barBySate.js');
  const randomStackedBarData = require('./dummyData/randomValues/stack.js');
  const randomBarDataTime = require('./dummyData/randomValues/barByDate.js');
  const randomLineData = require('./dummyData/randomValues/lineByDate.js');

  res.json([
    monthly(randomBarData),
    monthly(randomStackedBarData),
    monthly(randomBarDataTime),
    monthly(randomBarData),
    monthly(randomBarData),
    monthly(randomLineData),
  ]);
};

const operationData: RequestHandler = (_req, res) => {
  const randomBarData = require('./dummyData/randomValues/barBySate.js');
  const randomBarDataMonth = require('./dummyData/randomValues/barByMonth.js');
  const randomBarDataTime = require('./dummyData/randomValues/barByDate.js');
  const randomLineData = require('./dummyData/randomValues/lineByDate.js');

  res.json([
    randomBarData(),
    randomBarData(),
    randomBarDataMonth(),
    randomBarData(),
    randomBarDataTime(),
    randomLineData(),
  ]);
};

export default {
  POSUnits,
  locationData,
  headquarterData,
  industryData,
  digitalData,
  operationData,
};
