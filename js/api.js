const ServerUrl = {
  // GET_URL: 'https://26.javascript.pages.academy/keksobooking/data',
  // POST_URL: 'https://26.javascript.pages.academy/keksobooking',
  GET_URL: 'https://31.javascript.htmlacademy.pro/keksobooking/data',
  POST_URL: 'https://31.javascript.htmlacademy.pro/keksobooking',
};

const getData = (onSuccess, onFail) => {
  fetch(ServerUrl.GET_URL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => {
      onFail();
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(ServerUrl.POST_URL,
    {
      method: 'POST',
      body,
    })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export { getData, sendData };
