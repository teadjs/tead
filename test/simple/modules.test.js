const canDestructure = ({ x = true } = {}) => x;

export default {
  can: {
    use: {
      modules: [canDestructure(), true]
    }
  }
};
