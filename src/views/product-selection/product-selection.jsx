import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './product-selection.css';
import global from '../../../css/global.css';

import HeaderBar from '../../components/header-bar/header-bar';
import TextInput from '../../components/text-input/text-input';
import Button from '../../components/button/button';
import Tag from '../../components/tag/tag';
import NothingFoundCallSupport from '../../components/nothing-found-call-support/nothing-found-call-support';

const NoResult = ({ visible }) => (
  <div className={cx(styles.NoResult, !visible && styles.isHidden)}>
    <div className={styles.NoResultImage} />
    <div className={styles.NoResultText}>
      {translate('ProductSelectionNoResult')}
    </div>
  </div>
);

export default ({
  search,
  goTo,
  callSupport,
  updateSearch,
  searchResult,
  goToAnnotationSelection,
}) => (
  <div className={cx(styles.ProductSelection, global.BackgroundImage)}>
    <HeaderBar goBack={() => goTo('/')} title="ProductSelectionTitle" />
    <div className={styles.ProductSelectionContent}>
      <TextInput
        deleteButton
        value={search}
        setValue={updateSearch}
        className={styles.SelectProductInput}
        placeholder="SearchPlaceholder"
      />

      <div className={styles.Products}>
        <NoResult visible={!searchResult.length} />

        {searchResult.map(tags => (
          <div
            className={styles.Product}
            key={tags}
            onClick={() => goToAnnotationSelection(tags)}
          >
            {tags.map(tag => (
              <Tag key={tag} label={tag} />
            ))}
            <Button icon="next" small className={styles.SelectButton} />
          </div>
        ))}
      </div>

      <NothingFoundCallSupport callSupport={callSupport} />
    </div>
  </div>
);
