import { Component, OnInit, OnDestroy } from '@angular/core';

import { EMPTY, Observable,combineLatest, of, Subscription, Subject } from 'rxjs';
import { catchError, map, startWith} from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';

 // categories;
 // selectedCategoryId = 1;
//  products: Product[] = [];

private categorySelectedSubject = new Subject<number>();
categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  //products$:Observable<Product[]>;
  sub: Subscription;


  // productsSimpleFilter$ = this.productService.productsWithCategory$.pipe(map(
  //   products =>products.filter(product=>this.selectedCategoryId?product.categoryId === this.selectedCategoryId:true)
  // ));

  categories$=this.productCategoryService.productCategories$.pipe(
    catchError(err=>{this.errorMessage=err;
        return EMPTY;})
  );
  constructor(private productService: ProductService,private productCategoryService:ProductCategoryService) { }


  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$.pipe(startWith(0))
  ]).pipe(map(([products,selectedCategoryId])=>{
      return products.filter(product =>{
        return selectedCategoryId ? product.categoryId === selectedCategoryId : true
      })
  }),catchError(err=>{
    this.errorMessage =err;
    return EMPTY;
  }));

  ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe(
    //     products => this.products = products,
    //     error => this.errorMessage = error
    //   );

    // this.products$ = this.productService.productsWithCategory$.pipe(
    //   catchError(err => {
    //     this.errorMessage=err;
    //     return EMPTY;
    //   })
    // );

    

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
  // this.selectedCategoryId = +categoryId;
  this.categorySelectedSubject.next(+categoryId);
  }
}
