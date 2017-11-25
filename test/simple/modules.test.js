const canDestructure = ({ x = true, y = true } = {}) => x && y;

export default {
  can: {
    use: {
      modules: [canDestructure(), true]
    }
  }
};
