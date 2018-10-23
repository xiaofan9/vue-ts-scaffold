const os = require("os");
const ips = getIp();

module.exports = {
  ...ips,
  ip: (location, family = "ipv4") => {
    let tmp = ips[family];

    if (!isNaN(location)) {
      return tmp[location] || tmp[tmp.length - 1] || "";
    } else if (location === "start") {
      return tmp[0] || "";
    } else {
      return tmp[tmp.length - 1] || "";
    }
  }
};

function getIp() {
  const interfaces = os.networkInterfaces();
  const exclude = ["VMware", "VirtualBox", "VM"];

  let ipv4 = [];
  let ipv6 = [];

  for (var key in interfaces) {
    interfaces[key].forEach(function (details) {
      if (!details.internal && !exclude.find(v => key.includes(v))) {
        let details_ = {
          ...details,
          name: key
        };

        if (details.family === "IPv4") {
          ipv4.push(details_);
        } else if (details.family === "IPv6") {
          ipv6.push(details_);
        }
      }
    });
  }

  return {
    ipv4,
    ipv6
  };
}
