import { z } from 'zod';
import { MealMoment, PortionSize, PreparationMethod } from '../enums.js';

export const createMealInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moment: z.enum([MealMoment.BREAKFAST, MealMoment.LUNCH, MealMoment.DINNER, MealMoment.SNACK]),
  note: z.string().max(500).optional(),
});

export const addFoodLogInputSchema = z.object({
  foodId: z.string().uuid(),
  preparationMethod: z.enum([
    PreparationMethod.RAW,
    PreparationMethod.STEAMED,
    PreparationMethod.BOILED,
    PreparationMethod.ROASTED,
    PreparationMethod.FRIED,
    PreparationMethod.FERMENTED,
    PreparationMethod.LACTOFERMENTED,
    PreparationMethod.SPROUTED,
    PreparationMethod.SOAKED,
    PreparationMethod.DRIED,
    PreparationMethod.AGED,
    PreparationMethod.SMOKED,
  ]),
  portionSize: z.enum([PortionSize.SMALL, PortionSize.MEDIUM, PortionSize.LARGE]).optional(),
});

export const quickAddInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moment: z.enum([MealMoment.BREAKFAST, MealMoment.LUNCH, MealMoment.DINNER, MealMoment.SNACK]),
  foodId: z.string().uuid(),
  preparationMethod: z.enum([
    PreparationMethod.RAW,
    PreparationMethod.STEAMED,
    PreparationMethod.BOILED,
    PreparationMethod.ROASTED,
    PreparationMethod.FRIED,
    PreparationMethod.FERMENTED,
    PreparationMethod.LACTOFERMENTED,
    PreparationMethod.SPROUTED,
    PreparationMethod.SOAKED,
    PreparationMethod.DRIED,
    PreparationMethod.AGED,
    PreparationMethod.SMOKED,
  ]),
  portionSize: z.enum([PortionSize.SMALL, PortionSize.MEDIUM, PortionSize.LARGE]).optional(),
});
