import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const run = (randomize = _.shuffle) => {
  const fifteen = {
    order: randomize(values).concat(0),
    count: 0,
    hole: 15,
    // Проверка на собранность
    isCompleted() {
      return !this.order.some((item, i) => item > 0 && item - 1 !== i);
    },
    move: {
      ArrowUp: 1,
      ArrowLeft: 4,
      ArrowDown: -1,
      ArrowRight: -4,
    },

    go(step) {
      const index = this.hole + step;
      if (!this.order[index]) {
        return false;
      }
      // не всякое движение вправо-влево допустимо
      if (step === 1 || step === -1) {
        if (Math.floor(this.hole / 4) !== Math.floor(index / 4)) {
          return false;
        }
      }
      this.swap(index, this.hole);
      this.hole = index;
      return true;
    },

    // перестановка ячеек
    swap(i1, i2) {
      const t = this.order[i1];
      this.order[i1] = this.order[i2];
      this.order[i2] = t;
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
      document.querySelector('.gem-puzzle').innerHTML = '';
      document.querySelector('.gem-puzzle').innerHTML = `
      <table class="table-bordered">
          <tbody>
              <tr>
                  <td class="p-3">${this.order[0] || ''}</td>
                  <td class="p-3">${this.order[4] || ''}</td>
                  <td class="p-3">${this.order[8] || ''}</td>
                  <td class="p-3">${this.order[12] || ''}</td>
              </tr>
              <tr>
                  <td class="p-3">${this.order[1] || ''}</td>
                  <td class="p-3">${this.order[5] || ''}</td>
                  <td class="p-3">${this.order[9] || ''}</td>
                  <td class="p-3">${this.order[13] || ''}</td>
              </tr>
              <tr>
                  <td class="p-3">${this.order[2] || ''}</td>
                  <td class="p-3">${this.order[6] || ''}</td>
                  <td class="p-3">${this.order[10] || ''}</td>
                  <td class="p-3">${this.order[14] || ''}</td>
              </tr>
              <tr>
                  <td class="p-3">${this.order[3] || ''}</td>
                  <td class="p-3">${this.order[7] || ''}</td>
                  <td class="p-3">${this.order[11] || ''}</td>
                  <td class="p-3">${this.order[15] || ''}</td>
              </tr>
          </tbody>
        </table>`;
      document.querySelectorAll('.p-3').forEach((v) => {
        if (v.textContent === '') {
          v.classList.add('table-active');
        }
      });
    },
  };

  // Если пазл нерешаемый, делаем его решаемым.
  if (!fifteen.solvable(fifteen.order)) fifteen.swap(0, 1);

  fifteen.draw();
  document.addEventListener('keyup', (e) => {
    fifteen.count += 1;
    // console.log(fifteen.count);

    if (fifteen.go(fifteen.move[e.key])) {
      fifteen.draw();
    }
    if (fifteen.isCompleted()) {
        document.querySelector('table').style.backgroundColor = "gold";
        window.removeEventListener('keyup', handler);
        alert(`Поздравляю!!! \nВы собрали пазл за ${fifteen.count} шагов!`);
    }
  });
};

run();
