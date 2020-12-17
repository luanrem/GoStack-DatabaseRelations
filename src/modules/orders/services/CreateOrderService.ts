import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const findProducts = products.map(product => {
      return {
        id: product.id,
      };
    });

    const productsList = await this.productsRepository.findAllById(
      findProducts,
    );

    console.log('produto', productsList);

    const productsToCreate = products.map(product => {
      return {
        product_id: product.id,
        price: productsList.filter(p => (p.id === product.id ? p.price : null)),
        quantity: product.quantity,
      };
    });

    const customer = await this.customersRepository.findById(customer_id);

    const resultProduct: ICreateOrderDTO = {
      customer,
      products: productsToCreate,
    };

    if (customer && products) {
      await this.ordersRepository.create({
        customer,
        products: productsToCreate,
      });
    }

    // customer: Customer;
    // products: IProduct[
    //   {
    //     product_id: string;
    //     price: number;
    //     quantity: number;
    //   },
    //   {
    //     product_id: string;
    //     price: number;
    //     quantity: number;
    //   },
    // ];

    // const newProduct = products.map(product => {
    //   return {
    //     product.id,
    //     price
    //   }
    // })

    // const newProduct = products.map(product => {
    //   const price = await this.productsRepository.findAllById([product.id])

    //   return {
    //     product.id,
    //     price,
    //     product.quantity,
    //   }
    // })

    //   product_id: string;
    // price: number;
    // quantity: number;

    // const order = await this.ordersRepository.create({
    //   customer: customer_id,
    //   products,
    // });

    // const customerExist = await this.customersRepository.findByEmail(email);

    // if (customerExist) {
    //   throw new AppError('The customer already exists.');
    // }

    // const customer = await this.customersRepository.create({
    //   name,
    //   email,
    // });

    // return customer;
  }
}

export default CreateOrderService;
