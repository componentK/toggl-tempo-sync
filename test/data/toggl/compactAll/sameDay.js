module.exports.payload = [
  {
    id: 1138234410,
    guid: '4bb563dcd150e8c6c6d55d9b076d6421',
    wid: 1512934,
    pid: 142184150,
    billable: false,
    start: '2019-03-21T08:54:00+00:00',
    stop: '2019-03-21T09:08:41+00:00',
    duration: 881,
    description: 'INT-12 Time dump',
    duronly: false,
    at: '2019-03-21T09:09:09+00:00',
    uid: 2301412
  },
  {
    id: 1138241866,
    guid: 'bda396a17677bd42b840b1fb6a2c94a1',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T09:09:23+00:00',
    stop: '2019-03-21T09:30:44+00:00',
    duration: 1281,
    description: 'BIGC-823 preparing PR',
    duronly: false,
    at: '2019-03-21T14:50:08+00:00',
    uid: 2301412
  },
  {
    id: 1138273668,
    guid: '1aa5a5fbfb9b95148ff3a7b59593232a',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T09:30:51+00:00',
    stop: '2019-03-21T09:40:07+00:00',
    duration: 556,
    description: 'BIGC-824 bigc service hookup',
    duronly: false,
    at: '2019-03-21T09:40:19+00:00',
    uid: 2301412
  },
  {
    id: 1138317006,
    guid: 'd5bd5f6d71671fda48e59dacdb144c48',
    wid: 1512934,
    pid: 142184150,
    billable: false,
    start: '2019-03-21T10:12:35+00:00',
    stop: '2019-03-21T10:18:43+00:00',
    duration: 368,
    description: 'INT-12 Time dump',
    duronly: false,
    at: '2019-03-21T10:21:33+00:00',
    uid: 2301412
  },
  {
    id: 1138317197,
    guid: 'ad8baa50d99b777b66301d552422669c',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T10:21:17+00:00',
    stop: '2019-03-21T10:36:07+00:00',
    duration: 890,
    description: 'MAGENTO-2415 kill backend',
    duronly: false,
    at: '2019-03-21T10:38:54+00:00',
    uid: 2301412
  },
  {
    id: 1138338396,
    guid: '0464e41078dabd6f4194b481d21243c0',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T10:41:41+00:00',
    stop: '2019-03-21T10:50:33+00:00',
    duration: 532,
    description: 'MAGENTO-2415 kill backend',
    duronly: false,
    at: '2019-03-21T10:50:35+00:00',
    uid: 2301412
  },
  {
    id: 1138354254,
    guid: 'ddde1271e2a4fed773967c11b4bd4fe5',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T10:57:15+00:00',
    stop: '2019-03-21T11:00:24+00:00',
    duration: 189,
    description: 'MAGENTO-2415 kill backend',
    duronly: false,
    at: '2019-03-21T11:00:32+00:00',
    uid: 2301412
  },
  {
    id: 1138361470,
    guid: '63462dbb4a350d03b40f07e0890b39ff',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T11:04:33+00:00',
    stop: '2019-03-21T13:18:54+00:00',
    duration: 8061,
    description: 'MAGENTO-2415 kill backend',
    duronly: false,
    at: '2019-03-21T13:18:07+00:00',
    uid: 2301412
  },
  {
    id: 1138516376,
    guid: 'f41385bcfcf7a8373f2bab4eb73726f0',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T13:18:08+00:00',
    stop: '2019-03-21T13:35:17+00:00',
    duration: 1029,
    description: 'MAGENTO-2415 working with users solution',
    duronly: false,
    at: '2019-03-21T14:49:21+00:00',
    uid: 2301412
  },
  {
    id: 1138555170,
    guid: 'e966398e17ee2b8861f895e73f0b052f',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T13:42:14+00:00',
    stop: '2019-03-21T14:15:45+00:00',
    duration: 2011,
    description: 'MAGENTO-2415 working with users solution',
    duronly: false,
    at: '2019-03-21T14:48:59+00:00',
    uid: 2301412
  },
  {
    id: 1138616755,
    guid: '64a6afdd1cbfc1c89dad44981886ee13',
    wid: 1512934,
    pid: 150320558,
    billable: false,
    start: '2019-03-21T14:23:39+00:00',
    stop: '2019-03-21T14:48:34+00:00',
    duration: 1495,
    description: 'MAGENTO-2415 kill backend',
    duronly: false,
    at: '2019-03-21T14:48:06+00:00',
    uid: 2301412
  }
]
module.exports.expect = [
  {
    start: '2019-03-21T08:54:00+00:00',
    duration: 20.816666666666666,
    description: 'INT-12 Time dump'
  },
  {
    start: '2019-03-21T09:09:23+00:00',
    duration: 21.35,
    description: 'BIGC-823 preparing PR'
  },
  {
    start: '2019-03-21T09:30:51+00:00',
    duration: 9.266666666666667,
    description: 'BIGC-824 bigc service hookup'
  },
  {
    start: '2019-03-21T10:21:17+00:00',
    duration: 186.11666666666667,
    description: 'MAGENTO-2415 kill backend'
  },
  {
    start: '2019-03-21T13:18:08+00:00',
    duration: 50.666666666666664,
    description: 'MAGENTO-2415 working with users solution'
  }
]
