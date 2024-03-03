const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export {asyncHandler};

//using try catch optional to above code

//const asyncHandler = () => async;
//const asyncHandler = (fn) => () => {};
//const asyncHandler = (fn) => async () => {};

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       scuccess: false,
//       message: error.message,
//     });
//   }
// };
