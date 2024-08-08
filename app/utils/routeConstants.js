export default {
  repos: {
    route: '/',
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },

  itunes: {
    route: '/itunes',
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },

  trackDetails: {
    route: '/details/:trackId',
    props: {
      width: 50,
      height: 38,
      padding: 20
    },
    exact: true
  }
};
