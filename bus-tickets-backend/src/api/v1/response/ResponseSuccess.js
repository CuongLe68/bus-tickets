const successCallBack = (data) => {
  return {
    status: true,
    code: 200,
    message: `Thành Công`,
    data: data ? data : null,
  };
};

module.exports = {
  successCallBack,
};
