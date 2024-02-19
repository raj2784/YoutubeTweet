const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).reject((error) =>
      next(error),
    );
  };
};

export {asyncHandler};

//using try catch

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
