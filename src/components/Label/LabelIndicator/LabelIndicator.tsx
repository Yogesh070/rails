import styles from './LabelIndicator.module.scss';

const LabelIndicator = ({ color = 'red' }: { color: string }) => {
  return <div className={styles.main} style={{ backgroundColor: color }} />;
};

export default LabelIndicator;
