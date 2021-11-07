import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

export default name => {
  const actor = require("../.dfx/local/canisters/" + name + "/index.js")
    .createActor
  return actor(publicRuntimeConfig[`${name.toUpperCase()}_CANISTER_ID`], {
    agentOptions: {
      host: publicRuntimeConfig.NEXT_PUBLIC_IC_HOST,
    },
  })
}
