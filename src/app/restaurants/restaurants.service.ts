import { Injectable } from '@angular/core';
import { RestaurantModel } from './restaurant.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface RestaurantData{
  name: string;
  address: string;
  city: string;
  grade: number;
  text: string;
  imageUrl: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private _restaurants = new BehaviorSubject<RestaurantModel[]>([]);


  constructor(private http: HttpClient, private authService: AuthService) {

   }

  get restaurants() {
    return this._restaurants.asObservable();
  }

  addRestaurant(name: string, address: string, city: string, grade: number, text: string) {
    let generatedId: string;
    let newRestaurant: RestaurantModel;
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newRestaurant = new RestaurantModel(
          null,
          name,
          address,
          city,
          grade,
          'https://getsling.com/wp-content/uploads/2019/11/Types-Of-Restaurants_A.png',
          text,
          fetchedUserId
        );

        return this.http.post<{name: string}>(
          `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants.json?auth=${token}`, 
          newRestaurant
        );
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this._restaurants;
      }),
      take(1),
      tap((restaurants) => {
        newRestaurant.id = generatedId;
        const updatedRestaurants = restaurants.concat(newRestaurant);
        updatedRestaurants.sort((a, b) => b.grade - a.grade);
        this._restaurants.next(updatedRestaurants);
      })
    );
  }


  getRestaurants() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
        .get<{[key: string]: RestaurantData}>(
          `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants.json?auth=${token}`
          );
      }),
      map((restaurantsData) => {
        const restaurants: RestaurantModel[] = [];
        
        for(const key in restaurantsData) {
          if(restaurantsData.hasOwnProperty(key)) {
            restaurants.push( new RestaurantModel(key, restaurantsData[key].name, restaurantsData[key].address, restaurantsData[key].city, restaurantsData[key].grade, restaurantsData[key].imageUrl, restaurantsData[key].text, restaurantsData[key].userId)
            );
          }
        }
        return restaurants;
      }),
      tap(restaurants => {
        this._restaurants.next(restaurants);
      })

    );
    
  }

  getRestaurant(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<RestaurantData>(
          `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new RestaurantModel(
          id,
          resData.name,
          resData.address,
          resData.city,
          resData.grade,
          resData.imageUrl,
          resData.text,
          resData.userId,
        );
      })
    );
  }

  deleteRestaurant(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.restaurants;
      }),
      take(1),
      tap((restaurants) => {
        this._restaurants.next(restaurants.filter(restaurant => restaurant.id !== id));
      })
    );
  }

  editRestaurant(restaurantId: string, name: string, address: string, city: string, grade: number, imageUrl: string, text: string, userId: string ) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put(
          `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants/${restaurantId}.json?auth=${token}`,
          {name, address, city, grade, imageUrl, text, userId}
        );
      }),
      switchMap(() => this.restaurants),
      take(1),
      tap((restaurants) => {
        const updatedRestaurantIndex = restaurants.findIndex((r) => r.id === restaurantId);
        const updatedRestaurants = [...restaurants];
        updatedRestaurants[updatedRestaurantIndex] = new RestaurantModel(
          restaurantId,
          name,
          address,
          city,
          grade,
          'https://getsling.com/wp-content/uploads/2019/11/Types-Of-Restaurants_A.png',
          text,
          restaurants[updatedRestaurantIndex].userId
        );
        this._restaurants.next(updatedRestaurants);
      })
    );
  }


  /////

  getRestaurantsByUserId(userId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: RestaurantData }>(
            `https://restaurant-review-app-47636-default-rtdb.europe-west1.firebasedatabase.app/restaurants.json?auth=${token}`
          );
      }),
      map((restaurantsData) => {
        const restaurants: RestaurantModel[] = [];
  
        for (const key in restaurantsData) {
          if (restaurantsData.hasOwnProperty(key) && restaurantsData[key].userId === userId) {
            restaurants.push(
              new RestaurantModel(
                key,
                restaurantsData[key].name,
                restaurantsData[key].address,
                restaurantsData[key].city,
                restaurantsData[key].grade,
                restaurantsData[key].imageUrl,
                restaurantsData[key].text,
                restaurantsData[key].userId
              )
            );
          }
        }
        return restaurants.sort((a, b) => b.grade - a.grade);
      }),
      tap(restaurants => {
        this._restaurants.next(restaurants);
      })
    );
  }



}

