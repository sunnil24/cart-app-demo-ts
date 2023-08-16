// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h3>Cart</h3>`;

interface IProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
}

interface ICart {
  discountedTotal: number;
  id: number;
  products: IProduct[];
  total: number;
  totalProducts: number;
  totalQuantity: number;
  userId: number;
}

interface Carts {
  carts: ICart[];
  total: number;
  skip: number;
  limit: number;
}

enum URL {
  cart = 'https://dummyjson.com/carts',
}

class Product {
  productList: IProduct[];
  searchlist: IProduct[];
  cart: Carts;
  host: HTMLElement;
  listTem: any;

  constructor(host: string, searchTarget: string, resultTarget: string) {
    this.host = document.getElementById(host)! as HTMLElement;
    const template = document.querySelector(
      `#${searchTarget}`
    )! as HTMLTemplateElement;
    const elements = template.content.cloneNode(true) as HTMLTemplateElement;
    const searchWrapper = elements.querySelector('section');
    const input = searchWrapper.querySelector('input');
    const resetButton = searchWrapper.querySelector('button');
    input.addEventListener('keyup', this.search.bind(this));
    resetButton.addEventListener('click', this.resetSearch.bind(this));

    this.host.insertAdjacentElement('beforeend', searchWrapper);

    const templateResult = document.querySelector(
      `#${resultTarget}`
    ) as HTMLTemplateElement;
    this.listTem = templateResult.content.cloneNode(true);
  }

  createProductList() {
    const products = this.cart.carts.reduce((acc, { products }) => {
      return [...acc, ...products];
    }, []);
    this.productList = this.searchlist = products;
  }

  async fetch(): Promise<Carts> {
    const data = await fetch(URL.cart);
    const cartItems = await data.json();
    this.cart = cartItems;
    this.createProductList();
    return cartItems;
  }

  createCartList(target: HTMLElement) {
    this.searchlist?.forEach(({ title, price }) => {
      const li = document.createElement('li')! as HTMLLIElement;
      li.innerHTML = `<p>${title} <span class="green">INR ${price}</span></p>`;
      target.insertAdjacentElement('beforeend', li);
    });

    this.host.insertAdjacentElement('beforeend', target);
  }

  async render() {
    await this.fetch();
    const list = this.listTem.querySelector('ul');
    this.createCartList(list);
  }

  search(e: Event) {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const list = document.querySelector('ul');
    if (input.value) {
      const regex = new RegExp(input.value, 'i');
      this.searchlist = this.searchlist.filter(({ title }) => {
        return regex.test(title);
      });
    } else {
      this.searchlist = this.productList;
    }

    list.innerHTML = '';
    this.createCartList(list);
  }

  resetSearch() {
    this.searchlist = this.productList;
    const list = document.querySelector('ul');
    const input = document.querySelector('input');
    input.value = '';
    list.innerHTML = '';
    this.createCartList(list);
  }
}

const productList = new Product('app', 'search-box', 'list-template');
productList.render();
