module.exports = {
  initialization: function () {},
  handlers: {
    "rpc:request": [
      function (event) {
        const { payload } = event;
        if (payload.method === "eth_sendTransaction") {
          // TODO: Do we care about ID collisions?
          this.pendingTransactions[payload.id] = payload;

          this.spinner = this.getSpinner({
            text: `Waiting for transaction signature. Please check your wallet for a transaction approval message.`,
            color: "red"
          });
        }
      }
    ],
    "rpc:result": [
      function (event) {
        const { payload, error, result } = event;

        if (payload.method === "eth_sendTransaction") {
          if (error) {
            const errMessage = `Transaction submission failed with error ${error.code}: '${error.message}'`;
            if (this.spinner && this.spinner.isSpinning) {
              this.spinner.fail(errMessage);
            }
          } else {
            if (this.spinner && this.spinner.isSpinning) {
              this.spinner.succeed(
                `Transaction submitted successfully. Hash: ${result.result}`
              );
            }
          }

          delete this.pendingTransactions[payload.id];
        }
      }
    ]
  }
};
