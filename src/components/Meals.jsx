import MealItem from "./MealItem.jsx";
import meals from "../data/available-meals.json";

export default function Meals(){
    return(
        <ul id="meals">
            {meals.map((meal) => (
                <MealItem key={meal.id} meal={meal}/>
                ))}
        </ul>
    )
}