import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 3001);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'data', 'store.json');

const DEFAULT_USER = {
  name: 'Jameson Miller',
  rating: 4.9,
  rides: 1284,
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBVfdc_sc4MKXkjo7cHh94BpLSTZ5RbhQ7TWffR-pZWEUPwqoE9uMyeSruY9oLPQTZMPuI4EUsV6EcA0QjznWPSFIEj2athrPTsZNrWFbEsImroQuL54Uhe0Vdd8y6V9Vn9c32qOfysU7ZptzS63xzsZLKeMEd-Qm7dvr7Ct0qqGPYQUZnpDDKdEBWxHnxNFBulNMiJpJJPVaRgrAd5L4mFKheReS2c_r0q4S_Lgshjf_Pmo-rWL_N-2YUz0gcC9sQOZbIds-s6cLc',
  phone: '(123) 456-7890',
  email: 'j.miller@email.com',
  vehicle: {
    model: 'Toyota Camry',
    color: 'Midnight Black',
    plate: 'GQK-1234',
  },
};

const SEED_RIDE = {
  id: 'ride-123',
  passengerName: 'Bisi',
  passengerRating: 4.8,
  passengerImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUq-T8dROdcm9uNAbrFQHmpVk4TsQclTROGDMJVbKwb76-SHCRe_8Che70W4eo6YRzT3df1B6gk0iUV7UuRCpkycTTQTP4jpiCR9VM8KgfevShio267k14XPO8aupn0nXCZttXJn9ONVBeFAFjMUabK9yG2f_5Vgi0cKwaH4vBQ7VbvkpHbmvYU2AMwsDrle785lbCsPWNzjQwdg8vgNII84MISGWy4pVW2vp8W-w_nmOmAWKZ5YC30WrZ9HptKaa8YdgiauX10Ls',
  price: 5500,
  distance: '25 km',
  duration: '45 min',
  pickupAddress: '123 Allen Avenue, Ikeja',
  dropoffAddress: '456 Ozumba Mbadiwe, VI',
  pickup: '3.3515,6.6018',
  dropoff: '3.4352,6.4281',
  status: 'pending',
};

const INITIAL_TRANSACTIONS = [
  {
    id: 't1',
    type: 'Earning',
    title: 'Trip to VI',
    description: 'Lekki Phase 1 to Victoria Island',
    amount: 2500,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 't2',
    type: 'Earning',
    title: 'Trip to Ikoyi',
    description: 'Ikeja GRA to Dolphin Estate',
    amount: 1800,
    date: 'Today',
    status: 'Completed',
    timestamp: Date.now() - 7200000,
  },
];

const createInitialState = () => ({
  user: { ...DEFAULT_USER },
  isOnline: false,
  activeRide: null,
  queuedRide: { ...SEED_RIDE },
  walletBalance: 45700,
  transactions: [...INITIAL_TRANSACTIONS],
  withdrawalRequests: [],
});

const ensureDataFile = () => {
  if (!existsSync(dirname(DATA_FILE))) {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
  }

  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(createInitialState(), null, 2));
  }
};

const loadState = () => {
  ensureDataFile();
  try {
    const persisted = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    return {
      ...createInitialState(),
      ...persisted,
      user: { ...DEFAULT_USER, ...(persisted.user || {}) },
      transactions: Array.isArray(persisted.transactions) ? persisted.transactions : [],
      withdrawalRequests: Array.isArray(persisted.withdrawalRequests) ? persisted.withdrawalRequests : [],
    };
  } catch {
    return createInitialState();
  }
};

const state = loadState();

const persistState = () => {
  ensureDataFile();
  writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const sendEmpty = (res, status) => {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end();
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const server = createServer(async (req, res) => {
  const { method, url } = req;

  if (method === 'OPTIONS') {
    return sendEmpty(res, 204);
  }

  try {
    if (method === 'GET' && url === '/api/health') {
      return sendJson(res, 200, { ok: true });
    }

    if (method === 'GET' && url === '/api/bootstrap') {
      return sendJson(res, 200, {
        user: state.user,
        isOnline: state.isOnline,
        activeRide: state.activeRide,
        walletBalance: state.walletBalance,
        transactions: state.transactions,
        withdrawalRequests: state.withdrawalRequests,
      });
    }

    if (method === 'PATCH' && url === '/api/driver/status') {
      const body = await readBody(req);
      state.isOnline = Boolean(body.isOnline);
      persistState();
      return sendJson(res, 200, { isOnline: state.isOnline });
    }

    if (method === 'PATCH' && url === '/api/user') {
      const body = await readBody(req);
      state.user = { ...state.user, ...body };
      persistState();
      return sendJson(res, 200, state.user);
    }

    if (method === 'GET' && url === '/api/rides/next') {
      if (!state.isOnline || state.activeRide) {
        return sendEmpty(res, 204);
      }
      if (!state.queuedRide) {
        state.queuedRide = { ...SEED_RIDE, id: `ride-${Date.now()}`, status: 'pending' };
        persistState();
      }
      return sendJson(res, 200, state.queuedRide);
    }

    if (method === 'POST' && url?.match(/^\/api\/rides\/[^/]+\/accept$/)) {
      const id = url.split('/')[3];
      if (!state.queuedRide || state.queuedRide.id !== id) {
        return sendJson(res, 404, { message: 'Ride not found' });
      }
      state.activeRide = { ...state.queuedRide, status: 'pickup' };
      state.queuedRide = null;
      persistState();
      return sendJson(res, 200, state.activeRide);
    }

    if (method === 'POST' && url?.match(/^\/api\/rides\/[^/]+\/complete$/)) {
      const id = url.split('/')[3];
      if (!state.activeRide || state.activeRide.id !== id) {
        return sendJson(res, 404, { message: 'Ride not found' });
      }

      const driverEarnings = state.activeRide.price * 0.85;
      const transaction = {
        id: Date.now().toString(),
        type: 'Earning',
        title: `Trip to ${state.activeRide.dropoffAddress.split(',')[0]}`,
        description: `${state.activeRide.pickupAddress} to Destination`,
        amount: driverEarnings,
        date: 'Today',
        status: 'Completed',
        timestamp: Date.now(),
      };

      state.transactions = [transaction, ...state.transactions];
      state.walletBalance += driverEarnings;
      state.user.rides += 1;
      state.activeRide = null;
      persistState();

      return sendJson(res, 200, { transaction, walletBalance: state.walletBalance });
    }

    if (method === 'POST' && url === '/api/withdrawals') {
      const body = await readBody(req);
      const { amount, bankName, accountNumber, accountName } = body;

      if (!amount || amount <= 0) {
        return sendJson(res, 400, { message: 'Invalid amount' });
      }

      if (amount > state.walletBalance) {
        return sendJson(res, 400, { message: 'Insufficient balance' });
      }

      const id = Date.now().toString();
      const withdrawalRequest = {
        id,
        driverName: state.user.name,
        amount,
        bankName,
        accountNumber,
        accountName,
        status: 'Pending',
        date: 'Just now',
        timestamp: Date.now(),
      };

      const withdrawalTransaction = {
        id,
        type: 'Withdrawal',
        title: 'Withdrawal Request',
        description: `${bankName} - ${accountNumber}`,
        amount: -amount,
        date: 'Today',
        status: 'Pending',
        timestamp: Date.now(),
      };

      state.withdrawalRequests = [withdrawalRequest, ...state.withdrawalRequests];
      state.transactions = [withdrawalTransaction, ...state.transactions];
      state.walletBalance -= amount;
      persistState();

      return sendJson(res, 201, {
        withdrawalRequest,
        withdrawalTransaction,
        walletBalance: state.walletBalance,
      });
    }

    if (method === 'POST' && url?.match(/^\/api\/withdrawals\/[^/]+\/approve$/)) {
      const id = url.split('/')[3];
      let found = false;

      state.withdrawalRequests = state.withdrawalRequests.map((request) => {
        if (request.id !== id) return request;
        found = true;
        return { ...request, status: 'Paid' };
      });

      if (!found) {
        return sendJson(res, 404, { message: 'Withdrawal not found' });
      }

      state.transactions = state.transactions.map((tx) => (tx.id === id ? { ...tx, status: 'Paid' } : tx));
      persistState();
      return sendJson(res, 200, { id, status: 'Paid' });
    }

    return sendJson(res, 404, { message: 'Not found' });
  } catch {
    return sendJson(res, 500, { message: 'Internal server error' });
  }
});

server.listen(port, () => {
  console.log(`GoQuick backend listening on port ${port}`);
});
