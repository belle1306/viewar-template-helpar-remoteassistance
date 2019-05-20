import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './text-input.scss';
import global from '../../../css/global.scss';

export default ({
  className,
  handleSubmit,
  value,
  placeholder,
  setValue,
  searchButton,
  addButton,
  password,
}) => (
  <div
    className={cx(
      styles.TextInput,
      searchButton && styles.withSearch,
      value && styles.hasInput,
      className
    )}
  >
    <form onSubmit={handleSubmit}>
      <input
        type={password ? 'password' : 'text'}
        onChange={({ target }) => setValue(target.value)}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder={placeholder ? translate(placeholder, false) : ''}
      />
      {searchButton && (
        <div
          className={cx(styles.SearchButton, global.ButtonImage)}
          onClick={() => setValue('')}
        />
      )}
      {!searchButton && addButton && (
        <div
          className={cx(styles.AddButton, global.ButtonImage)}
          onClick={handleSubmit}
        />
      )}
    </form>
  </div>
);
