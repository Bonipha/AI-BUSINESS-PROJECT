const defaultBaseUrl = process.env.ZENOPAY_BASE_URL || 'https://zenoapi.com/api';
const apiKey = process.env.ZENOPAY_API_KEY;

function getHeaders() {
  if (!apiKey) {
    throw new Error('ZENOPAY_API_KEY must be configured');
  }

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${defaultBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  const responseText = await response.text();
  let data;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { message: responseText };
  }

  if (!response.ok) {
    const error = new Error(data.message || `ZenoPay request failed with status ${response.status}`);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

async function createPayment({ amount, orderId, customerEmail, customerPhone, description }) {
  if (!amount || !orderId || (!customerEmail && !customerPhone)) {
    throw new Error('Amount, orderId, and customer email or phone are required');
  }

  return request(process.env.ZENOPAY_PAYMENT_PATH || '/payments', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      order_id: orderId,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      description,
    }),
  });
}

async function getPaymentStatus(orderId) {
  if (!orderId) {
    throw new Error('orderId is required');
  }

  const path = process.env.ZENOPAY_STATUS_PATH || `/payments/${encodeURIComponent(orderId)}`;
  return request(path, { method: 'GET' });
}

export {
  createPayment,
  getPaymentStatus,
};
