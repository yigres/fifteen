import './style.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import $ from 'jquery';

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const run = (randomize = _.shuffle) => {
  const fifteen = {
    randomValues: randomize(values).concat(0),
    count: 0,
    hole: 15,
    // Проверка на собранность
    isCompleted() {
      return !this.randomValues.some((item, i) => item > 0 && item - 1 !== i);
    },
    move: {
      ArrowUp: 1,
      ArrowLeft: 4,
      ArrowDown: -1,
      ArrowRight: -4,
    },

    go(step) {
      const index = this.hole + step;
      if (!this.randomValues[index]) {
        return false;
      }
      // не всякое движение вправо-влево допустимо
      if (step === 1 || step === -1) {
        if (Math.floor(this.hole / 4) !== Math.floor(index / 4)) {
          return false;
        }
      }

      const tableEl = document.querySelector('table');

      const holeRowIndex = this.hole % 4;
      const holeCellIndex = Math.floor(this.hole / 4);
      const newPositionRowIndex = index % 4;
      const newPositionCellIndex = Math.floor(index / 4);

      const row = tableEl.rows.item(newPositionRowIndex);
      if (row) {
        const cell = row.cells.item(newPositionCellIndex);
        if (cell) {
          const point = tableEl.rows.item(holeRowIndex).cells.item(holeCellIndex);
          point.textContent = cell.textContent;
          point.classList.remove('table-active');
          cell.textContent = '';
          cell.classList.add('table-active');
          this.swap(index, this.hole);
          this.hole = index;
        }
      }

      return true;
    },

    // перестановка ячеек
    swap(i1, i2) {
      const t = this.randomValues[i1];
      this.randomValues[i1] = this.randomValues[i2];
      this.randomValues[i2] = t;
    },
    // проверка на решаемость
    solvable(a) {
      let kDisorder = 0;
      for (let i = 1, len = a.length - 1; i < len; i += 1) {
        for (let j = i - 1; j >= 0; j -= 1) {
          if (a[j] > a[i]) kDisorder += 1;
        }
      }

      return !(kDisorder % 2);
    },

    draw() {
      const root = document.querySelector('.gem-puzzle');
      document.querySelector('.gem-puzzle').innerHTML = '';
      const tableEl = document.createElement('table');
      tableEl.className = 'table-bordered';
      root.append(tableEl);

      for (let i = 0; i < 4; i += 1) {
        const row = tableEl.insertRow();
        for (let j = 0; j < 4; j += 1) {
          const cell = row.insertCell();
          cell.className = 'p-3';
          if (this.randomValues[i + (j * 4)] === 0) {
            cell.classList.add('table-active');
          }
          cell.textContent = this.randomValues[i + (j * 4)] || '';
        }
      }
    },
    showResult() {
      document.querySelector('table').style.backgroundColor = 'gold';
      document.querySelector('div.modal-body').textContent = `Вы собрали пазл за ${this.count} шагов!`;
      $('#exampleModal').modal('show');
    },
  };

  // Если пазл нерешаемый, делаем его решаемым.
  if (!fifteen.solvable(fifteen.randomValues)) fifteen.swap(0, 1);

  fifteen.draw();

  document.addEventListener('keyup', function handler(e) {
    fifteen.count += 1;
    fifteen.go(fifteen.move[e.key]);

    if (fifteen.isCompleted()) {
      document.removeEventListener('keyup', handler);
      fifteen.showResult(handler);
    }
  });

  let initialPoint;
  let finalPoint;
  const handler1 = (event) => {
    event.preventDefault();
    event.stopPropagation();
    [initialPoint] = event.changedTouches;
  };

  document.addEventListener('touchstart', handler1);
  document.addEventListener('touchend', function handler2(event) {
    fifteen.count += 1;
    event.preventDefault();
    event.stopPropagation();
    [finalPoint] = event.changedTouches;
    const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
    const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
    if (xAbs > 2 || xAbs > 2) {
      if (xAbs > yAbs) {
        if (finalPoint.pageX < initialPoint.pageX) {
          fifteen.go(4);
          /* СВАЙП ВЛЕВО */
        } else {
          /* СВАЙП ВПРАВО */
          fifteen.go(-4);
        }
      } else if (finalPoint.pageY < initialPoint.pageY) {
        /* СВАЙП ВВЕРХ */
        fifteen.go(1);
      } else {
        /* СВАЙП ВНИЗ */
        fifteen.go(-1);
      }
    }

    if (fifteen.isCompleted()) {
      document.removeEventListener('touchstart', handler1);
      document.removeEventListener('touchend', handler2);
      fifteen.showResult();
    }
  });
};

run();
