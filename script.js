// ===== FitGenius AI — Core Engine =====

document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initNavigation();
    initForm();
});

// ===== Animated Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Navigation =====
function initNavigation() {
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });
}

// ===== Form Handling =====
function initForm() {
    const form = document.getElementById('fitness-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generatePlan();
    });
}

function generatePlan() {
    const btn = document.getElementById('submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    // Collect form data
    const data = {
        name: document.getElementById('name').value.trim(),
        age: parseInt(document.getElementById('age').value),
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        goal: document.getElementById('goal').value,
        activity: document.getElementById('activity').value,
        diet: document.getElementById('diet').value,
        health: document.getElementById('health').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || 'male'
    };

    // Simulate AI processing delay
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        renderResults(data);
    }, 2200);
}

// ===== Health Calculations =====
function calcBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    return (weight / (heightM * heightM)).toFixed(1);
}

function bmiCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--accent-3)' };
    if (bmi < 25)   return { label: 'Normal', color: 'var(--success)' };
    if (bmi < 30)   return { label: 'Overweight', color: 'var(--warning)' };
    return { label: 'Obese', color: 'var(--danger)' };
}

function calcBMR(weight, height, age, gender) {
    if (gender === 'female') return 10 * weight + 6.25 * height - 5 * age - 161;
    return 10 * weight + 6.25 * height - 5 * age + 5;
}

function calcTDEE(bmr, activity) {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extreme: 1.9
    };
    return Math.round(bmr * (multipliers[activity] || 1.55));
}

function calcTargetCalories(tdee, goal) {
    const adjustments = {
        weight_loss: -500,
        muscle_gain: 350,
        endurance: 200,
        flexibility: 0,
        general_fitness: 0,
        athletic: 400
    };
    return tdee + (adjustments[goal] || 0);
}

function calcWaterIntake(weight, activity) {
    let base = weight * 0.033;
    const extra = { sedentary: 0, light: 0.3, moderate: 0.5, active: 0.7, extreme: 1.0 };
    return (base + (extra[activity] || 0.3)).toFixed(1);
}

// ===== Label Helpers =====
const goalLabels = {
    weight_loss: '🔥 Weight Loss',
    muscle_gain: '💪 Muscle Gain',
    endurance: '🏃 Endurance & Stamina',
    flexibility: '🧘 Flexibility & Mobility',
    general_fitness: '⚡ General Fitness',
    athletic: '🏆 Athletic Performance'
};

const activityLabels = {
    sedentary: 'Sedentary',
    light: 'Lightly Active',
    moderate: 'Moderately Active',
    active: 'Very Active',
    extreme: 'Extremely Active'
};

const dietLabels = {
    vegetarian: '🥬 Vegetarian',
    vegan: '🌱 Vegan',
    non_vegetarian: '🥩 Non-Vegetarian',
    eggetarian: '🥚 Eggetarian',
    keto: '🧀 Keto',
    mediterranean: '🫒 Mediterranean'
};

const healthLabels = {
    none: 'None',
    diabetes: 'Diabetes',
    hypertension: 'Hypertension',
    thyroid: 'Thyroid Disorder',
    pcos: 'PCOS',
    back_pain: 'Chronic Back Pain',
    asthma: 'Asthma',
    joint_issues: 'Joint Issues / Arthritis'
};

// ===== Workout Data =====
function getWorkoutPlan(goal, health, activity) {
    const plans = {
        weight_loss: [
            { day: 'Mon', name: 'Monday', type: 'cardio', tag: 'Cardio', exercises: 'Brisk walking 30 min, Jump rope 3×2 min, Burpees 3×10, Mountain climbers 3×15' },
            { day: 'Tue', name: 'Tuesday', type: 'strength', tag: 'Strength', exercises: 'Squats 4×15, Lunges 3×12/leg, Push-ups 3×12, Plank 3×45s' },
            { day: 'Wed', name: 'Wednesday', type: 'cardio', tag: 'Cardio', exercises: 'Cycling 35 min, High knees 3×30s, Box jumps 3×10, Cool-down stretching' },
            { day: 'Thu', name: 'Thursday', type: 'rest', tag: 'Rest', exercises: 'Active recovery — light walk 20 min, foam rolling, gentle stretching' },
            { day: 'Fri', name: 'Friday', type: 'hiit', tag: 'HIIT', exercises: '30s on/30s off: Burpees, Squat jumps, Push-ups, Bicycle crunches × 4 rounds' },
            { day: 'Sat', name: 'Saturday', type: 'strength', tag: 'Strength', exercises: 'Deadlifts 4×12, Rows 3×12, Shoulder press 3×10, Core circuit 3 rounds' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Full rest day — focus on sleep, hydration, and meal prep for the week' }
        ],
        muscle_gain: [
            { day: 'Mon', name: 'Monday', type: 'strength', tag: 'Strength', exercises: 'Bench press 4×8, Incline dumbbell press 3×10, Cable flyes 3×12, Tricep dips 3×10' },
            { day: 'Tue', name: 'Tuesday', type: 'strength', tag: 'Strength', exercises: 'Barbell squats 4×8, Leg press 3×10, Romanian deadlifts 3×10, Calf raises 4×15' },
            { day: 'Wed', name: 'Wednesday', type: 'rest', tag: 'Rest', exercises: 'Active recovery — 20 min walk, stretching, mobility work' },
            { day: 'Thu', name: 'Thursday', type: 'strength', tag: 'Strength', exercises: 'Pull-ups 4×8, Barbell rows 4×8, Face pulls 3×12, Bicep curls 3×12' },
            { day: 'Fri', name: 'Friday', type: 'strength', tag: 'Strength', exercises: 'Overhead press 4×8, Lateral raises 3×12, Front raises 3×10, Shrugs 3×12' },
            { day: 'Sat', name: 'Saturday', type: 'mixed', tag: 'Mixed', exercises: 'Deadlifts 4×6, Farmer\'s walks 3×40m, Core circuit, Light cardio 15 min' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Complete rest — prioritize protein intake, sleep 8+ hours' }
        ],
        endurance: [
            { day: 'Mon', name: 'Monday', type: 'cardio', tag: 'Cardio', exercises: 'Running 5K at moderate pace, dynamic warm-up, cool-down stretching' },
            { day: 'Tue', name: 'Tuesday', type: 'strength', tag: 'Strength', exercises: 'Bodyweight circuit: Push-ups, Squats, Lunges, Planks — 4 rounds' },
            { day: 'Wed', name: 'Wednesday', type: 'cardio', tag: 'Cardio', exercises: 'Interval running: 400m fast / 200m jog × 6, Cycling 20 min' },
            { day: 'Thu', name: 'Thursday', type: 'rest', tag: 'Rest', exercises: 'Recovery — yoga flow 30 min, foam rolling, hydration focus' },
            { day: 'Fri', name: 'Friday', type: 'cardio', tag: 'Cardio', exercises: 'Tempo run 30 min, Stair climbing 15 min, Jump rope 3×3 min' },
            { day: 'Sat', name: 'Saturday', type: 'mixed', tag: 'Mixed', exercises: 'Long run 8K easy pace, Bodyweight strength circuit 2 rounds' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Full rest — meal prep, sleep recovery, light stretching if desired' }
        ],
        flexibility: [
            { day: 'Mon', name: 'Monday', type: 'flexibility', tag: 'Flexibility', exercises: 'Yoga Vinyasa flow 45 min — Sun salutations, warrior series, balance poses' },
            { day: 'Tue', name: 'Tuesday', type: 'strength', tag: 'Strength', exercises: 'Pilates core 30 min, Resistance band work — shoulders, hips, ankles' },
            { day: 'Wed', name: 'Wednesday', type: 'flexibility', tag: 'Flexibility', exercises: 'Deep stretching 40 min — hamstrings, hip flexors, thoracic spine, shoulders' },
            { day: 'Thu', name: 'Thursday', type: 'cardio', tag: 'Cardio', exercises: 'Swimming 30 min or Brisk walking 40 min, dynamic mobility drills' },
            { day: 'Fri', name: 'Friday', type: 'flexibility', tag: 'Flexibility', exercises: 'Yin yoga 50 min — long holds, deep hip openers, spinal twists' },
            { day: 'Sat', name: 'Saturday', type: 'mixed', tag: 'Mixed', exercises: 'Dance fitness 30 min, Foam rolling 15 min, Balance board work' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Restorative yoga or meditation 20 min — gentle movement only' }
        ],
        general_fitness: [
            { day: 'Mon', name: 'Monday', type: 'strength', tag: 'Strength', exercises: 'Push-ups 3×15, Goblet squats 3×12, Dumbbell rows 3×10, Plank 3×45s' },
            { day: 'Tue', name: 'Tuesday', type: 'cardio', tag: 'Cardio', exercises: 'Jogging 25 min, Jump rope 3×2 min, High knees 3×30s, Cool down' },
            { day: 'Wed', name: 'Wednesday', type: 'flexibility', tag: 'Flexibility', exercises: 'Yoga flow 30 min, Foam rolling, Dynamic stretching sequence' },
            { day: 'Thu', name: 'Thursday', type: 'strength', tag: 'Strength', exercises: 'Lunges 3×12, Shoulder press 3×10, Deadlifts 3×10, Russian twists 3×20' },
            { day: 'Fri', name: 'Friday', type: 'hiit', tag: 'HIIT', exercises: '20 min HIIT: Burpees, Squat jumps, Push-ups, Mountain climbers × 4 rounds' },
            { day: 'Sat', name: 'Saturday', type: 'cardio', tag: 'Cardio', exercises: 'Outdoor activity — cycling, swimming, or hiking 45 min' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Complete rest — focus on recovery, nutrition, and hydration' }
        ],
        athletic: [
            { day: 'Mon', name: 'Monday', type: 'strength', tag: 'Strength', exercises: 'Power cleans 4×5, Back squats 4×6, Box jumps 4×8, Core stability 3 rounds' },
            { day: 'Tue', name: 'Tuesday', type: 'hiit', tag: 'HIIT', exercises: 'Sprint intervals 8×100m, Agility ladder drills, Plyometric circuit 3 rounds' },
            { day: 'Wed', name: 'Wednesday', type: 'strength', tag: 'Strength', exercises: 'Bench press 4×6, Weighted pull-ups 4×6, Military press 3×8, Farmer walks 3×40m' },
            { day: 'Thu', name: 'Thursday', type: 'rest', tag: 'Rest', exercises: 'Active recovery — swimming 20 min, sports massage, mobility drills' },
            { day: 'Fri', name: 'Friday', type: 'mixed', tag: 'Mixed', exercises: 'Deadlifts 4×5, Sled pushes 4×20m, Battle ropes 3×30s, Tire flips 3×8' },
            { day: 'Sat', name: 'Saturday', type: 'cardio', tag: 'Cardio', exercises: 'Sport-specific training 60 min, Conditioning circuit, Flexibility work' },
            { day: 'Sun', name: 'Sunday', type: 'rest', tag: 'Rest', exercises: 'Full rest & recovery — cold therapy, sleep optimization, meal prep' }
        ]
    };

    let plan = plans[goal] || plans.general_fitness;

    // Adjust for health conditions
    if (health === 'back_pain') {
        plan = plan.map(d => {
            if (d.type === 'strength') {
                return { ...d, exercises: d.exercises.replace(/Deadlifts \d+×\d+/g, 'Bird-dogs 3×12').replace(/Squats \d+×\d+/g, 'Wall sits 3×30s') + ' (modified for back safety)' };
            }
            return d;
        });
    }
    if (health === 'joint_issues') {
        plan = plan.map(d => {
            if (d.type === 'hiit' || d.type === 'cardio') {
                return { ...d, exercises: d.exercises.replace(/Jump rope/g, 'Elliptical').replace(/Box jumps/g, 'Step-ups').replace(/Burpees/g, 'Modified burpees (no jump)') + ' (low-impact adjustments)' };
            }
            return d;
        });
    }
    if (health === 'asthma') {
        plan = plan.map(d => {
            if (d.type === 'hiit') {
                return { ...d, type: 'cardio', tag: 'Cardio', exercises: 'Moderate-intensity cycling 25 min, Walking intervals 15 min (avoid overexertion, keep inhaler nearby)' };
            }
            return d;
        });
    }

    return plan;
}

// ===== Nutrition Data =====
function getNutritionPlan(goal, diet, targetCals, health) {
    const mealPlans = {
        vegetarian: {
            weight_loss: {
                breakfast: { items: ['Oats with almond milk & berries', 'Chia seed pudding with nuts', 'Green tea'], macros: { protein: '18g', carbs: '40g', fats: '12g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Brown rice with dal & mixed veggies', 'Paneer tikka salad', 'Buttermilk'], macros: { protein: '28g', carbs: '55g', fats: '14g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Mixed nuts (20g)', 'Apple with peanut butter', 'Green juice'], macros: { protein: '8g', carbs: '20g', fats: '10g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Quinoa vegetable stir-fry', 'Spinach soup', 'Multigrain roti'], macros: { protein: '22g', carbs: '35g', fats: '10g' }, time: '7:00 – 8:00 PM' }
            },
            muscle_gain: {
                breakfast: { items: ['Paneer bhurji with whole wheat toast', 'Banana protein smoothie', 'Handful of almonds'], macros: { protein: '32g', carbs: '50g', fats: '18g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Rajma curry with brown rice', 'Grilled paneer with veggies', 'Curd'], macros: { protein: '38g', carbs: '65g', fats: '16g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Protein shake with banana', 'Roasted chana', 'Dates & walnuts'], macros: { protein: '25g', carbs: '35g', fats: '12g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Tofu stir-fry with quinoa', 'Lentil soup', 'Sweet potato mash'], macros: { protein: '30g', carbs: '55g', fats: '14g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Idli with sambar & coconut chutney', 'Mixed fruit bowl', 'Filter coffee'], macros: { protein: '14g', carbs: '48g', fats: '8g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Roti with mixed dal & sabzi', 'Raita', 'Green salad'], macros: { protein: '24g', carbs: '60g', fats: '12g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Sprouts chaat', 'Coconut water', 'Trail mix'], macros: { protein: '10g', carbs: '22g', fats: '8g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Vegetable khichdi', 'Palak paneer', 'Whole wheat roti'], macros: { protein: '22g', carbs: '50g', fats: '14g' }, time: '7:00 – 8:00 PM' }
            }
        },
        vegan: {
            weight_loss: {
                breakfast: { items: ['Smoothie bowl (banana, spinach, oat milk)', 'Flaxseed granola', 'Herbal tea'], macros: { protein: '15g', carbs: '42g', fats: '10g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Chickpea quinoa bowl', 'Avocado & roasted veggie wrap', 'Lemon water'], macros: { protein: '22g', carbs: '50g', fats: '16g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Hummus with cucumber sticks', 'Mixed seeds', 'Green apple'], macros: { protein: '8g', carbs: '18g', fats: '10g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Lentil curry with brown rice', 'Steamed broccoli & tofu', 'Turmeric latte'], macros: { protein: '24g', carbs: '40g', fats: '12g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Avocado toast on sourdough', 'Soy milk latte', 'Chia pudding with berries'], macros: { protein: '16g', carbs: '45g', fats: '18g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Buddha bowl — tofu, brown rice, edamame, veggies', 'Miso soup', 'Kombucha'], macros: { protein: '28g', carbs: '58g', fats: '14g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Energy balls (dates, oats, cocoa)', 'Almond butter & banana', 'Coconut water'], macros: { protein: '10g', carbs: '30g', fats: '12g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Stuffed bell peppers with quinoa & black beans', 'Mixed green salad', 'Fresh fruit'], macros: { protein: '24g', carbs: '48g', fats: '12g' }, time: '7:00 – 8:00 PM' }
            }
        },
        non_vegetarian: {
            weight_loss: {
                breakfast: { items: ['Egg white omelette with spinach', 'Whole grain toast', 'Black coffee'], macros: { protein: '28g', carbs: '30g', fats: '8g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Grilled chicken breast with brown rice', 'Steamed veggies', 'Greek yogurt'], macros: { protein: '42g', carbs: '45g', fats: '12g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Boiled eggs (2)', 'Almonds (15g)', 'Green tea'], macros: { protein: '14g', carbs: '6g', fats: '12g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Grilled fish with lemon & herbs', 'Quinoa salad', 'Steamed broccoli'], macros: { protein: '36g', carbs: '30g', fats: '10g' }, time: '7:00 – 8:00 PM' }
            },
            muscle_gain: {
                breakfast: { items: ['Scrambled eggs (4) with avocado toast', 'Protein smoothie', 'Oatmeal with honey'], macros: { protein: '42g', carbs: '55g', fats: '22g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Chicken biryani (lean)', 'Grilled chicken tikka', 'Raita & green salad'], macros: { protein: '48g', carbs: '70g', fats: '18g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Whey protein shake', 'Banana & peanut butter', 'Trail mix'], macros: { protein: '30g', carbs: '35g', fats: '14g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Salmon fillet with sweet potato', 'Stir-fried vegetables', 'Brown rice (1 cup)'], macros: { protein: '40g', carbs: '55g', fats: '16g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Boiled eggs (3) with multigrain bread', 'Fresh orange juice', 'Mixed fruit'], macros: { protein: '24g', carbs: '40g', fats: '14g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Chicken curry with brown rice', 'Mixed vegetable salad', 'Curd'], macros: { protein: '36g', carbs: '60g', fats: '16g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Protein bar', 'Handful of nuts', 'Coconut water'], macros: { protein: '15g', carbs: '20g', fats: '10g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Grilled fish tacos', 'Soup (chicken/veggie)', 'Whole wheat wrap'], macros: { protein: '32g', carbs: '45g', fats: '14g' }, time: '7:00 – 8:00 PM' }
            }
        },
        eggetarian: {
            weight_loss: {
                breakfast: { items: ['Egg white scramble with veggies', 'Whole wheat toast', 'Green tea'], macros: { protein: '24g', carbs: '32g', fats: '8g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Egg curry with brown rice', 'Mixed bean salad', 'Buttermilk'], macros: { protein: '28g', carbs: '48g', fats: '14g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Boiled eggs (2)', 'Apple slices', 'Walnuts (10g)'], macros: { protein: '14g', carbs: '15g', fats: '10g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Vegetable omelette', 'Mushroom soup', 'Multigrain bread'], macros: { protein: '22g', carbs: '30g', fats: '10g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Masala omelette with toast', 'Banana smoothie with milk', 'Handful of almonds'], macros: { protein: '26g', carbs: '45g', fats: '14g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Egg fried rice with vegetables', 'Dal fry', 'Curd & salad'], macros: { protein: '30g', carbs: '58g', fats: '14g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Egg salad sandwich', 'Mixed fruit', 'Green juice'], macros: { protein: '16g', carbs: '25g', fats: '10g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Spinach egg curry', 'Quinoa or roti', 'Steamed vegetables'], macros: { protein: '24g', carbs: '42g', fats: '12g' }, time: '7:00 – 8:00 PM' }
            }
        },
        keto: {
            weight_loss: {
                breakfast: { items: ['Bulletproof coffee', 'Avocado & bacon (or paneer)', 'Scrambled eggs in butter'], macros: { protein: '22g', carbs: '6g', fats: '38g' }, time: '8:00 – 9:00 AM' },
                lunch: { items: ['Caesar salad with grilled chicken/paneer', 'Olive oil dressing', 'Cheese cubes'], macros: { protein: '34g', carbs: '8g', fats: '32g' }, time: '1:00 – 2:00 PM' },
                snack: { items: ['Macadamia nuts', 'Celery with cream cheese', 'Dark chocolate (85%)'], macros: { protein: '6g', carbs: '5g', fats: '18g' }, time: '4:30 – 5:00 PM' },
                dinner: { items: ['Salmon/Paneer with cauliflower mash', 'Sautéed spinach in garlic butter', 'Bone broth'], macros: { protein: '32g', carbs: '8g', fats: '28g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Keto smoothie (coconut milk, MCT oil, spinach)', 'Cheese omelette', 'Avocado half'], macros: { protein: '24g', carbs: '8g', fats: '36g' }, time: '8:00 – 9:00 AM' },
                lunch: { items: ['Zucchini noodles with pesto & chicken/tofu', 'Side salad with olive oil', 'Sparkling water'], macros: { protein: '32g', carbs: '10g', fats: '30g' }, time: '1:00 – 2:00 PM' },
                snack: { items: ['Fat bombs (coconut & cocoa)', 'Pecans', 'String cheese'], macros: { protein: '8g', carbs: '4g', fats: '22g' }, time: '4:30 – 5:00 PM' },
                dinner: { items: ['Butter chicken/Paneer butter masala (no sugar)', 'Cauliflower rice', 'Keto garlic bread'], macros: { protein: '36g', carbs: '10g', fats: '32g' }, time: '7:00 – 8:00 PM' }
            }
        },
        mediterranean: {
            weight_loss: {
                breakfast: { items: ['Greek yogurt with honey, walnuts & figs', 'Whole grain pita with hummus', 'Herbal tea'], macros: { protein: '18g', carbs: '38g', fats: '16g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Grilled fish/falafel with tabbouleh', 'Olive oil dressed salad', 'Lentil soup'], macros: { protein: '30g', carbs: '45g', fats: '18g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Olives & feta', 'Cucumber & tomato salad', 'Whole grain crackers'], macros: { protein: '8g', carbs: '15g', fats: '12g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Herb roasted vegetables with couscous', 'Grilled halloumi', 'Fresh fruit & mint tea'], macros: { protein: '22g', carbs: '40g', fats: '14g' }, time: '7:00 – 8:00 PM' }
            },
            default: {
                breakfast: { items: ['Shakshuka (eggs in tomato sauce)', 'Whole grain bread & olive oil', 'Fresh juice'], macros: { protein: '22g', carbs: '42g', fats: '18g' }, time: '7:00 – 8:00 AM' },
                lunch: { items: ['Mediterranean bowl — falafel, hummus, grains, greens', 'Tzatziki', 'Pomegranate juice'], macros: { protein: '26g', carbs: '55g', fats: '20g' }, time: '12:30 – 1:30 PM' },
                snack: { items: ['Mixed nuts & dried figs', 'Labneh with za\'atar & pita', 'Fresh grapes'], macros: { protein: '10g', carbs: '28g', fats: '14g' }, time: '4:00 – 4:30 PM' },
                dinner: { items: ['Grilled sea bass/vegetable moussaka', 'Orzo pasta salad', 'Baklava (1 piece)'], macros: { protein: '30g', carbs: '50g', fats: '18g' }, time: '7:00 – 8:00 PM' }
            }
        }
    };

    const dietPlan = mealPlans[diet] || mealPlans.vegetarian;
    let meals;
    if (dietPlan[goal]) {
        meals = dietPlan[goal];
    } else {
        meals = dietPlan.default || dietPlan[Object.keys(dietPlan)[0]];
    }

    // Health condition adjustments (notes)
    if (health === 'diabetes') {
        Object.values(meals).forEach(meal => {
            meal.items.push('⚠️ Choose low-GI options, avoid added sugars');
        });
    }
    if (health === 'hypertension') {
        Object.values(meals).forEach(meal => {
            meal.items.push('⚠️ Reduce sodium — use herbs & spices for flavor');
        });
    }

    return meals;
}

// ===== Motivation Messages =====
function getMotivation(name, goal) {
    const msgs = {
        weight_loss: {
            quote: `${name}, every rep, every step, every healthy meal is a vote for the person you're becoming. You didn't come this far to only come this far.`,
            sub: 'Consistency beats perfection. Trust the process and celebrate small wins every single day. 💪'
        },
        muscle_gain: {
            quote: `${name}, the iron doesn't judge — it just builds. Show up, lift heavy, eat right, and watch your body transform into something extraordinary.`,
            sub: 'Muscles grow when you rest. Train hard, recover harder, and fuel your ambition. 🏆'
        },
        endurance: {
            quote: `${name}, the only run you regret is the one you didn't take. Your lungs will burn, your legs will ache — but your spirit? Unbreakable.`,
            sub: 'Push your limits today so tomorrow\'s limits don\'t push you. Keep moving forward. 🏃'
        },
        flexibility: {
            quote: `${name}, flexibility isn't just about touching your toes — it's about being open to growth, change, and becoming your best self.`,
            sub: 'Breathe deep, stretch further, and remember: progress is found in stillness too. 🧘'
        },
        general_fitness: {
            quote: `${name}, the best project you'll ever work on is YOU. Every workout is an investment in a healthier, happier, stronger version of yourself.`,
            sub: 'You don\'t have to be extreme — just consistent. Show up for yourself, and the results will follow. ⚡'
        },
        athletic: {
            quote: `${name}, champions aren't made in the spotlight — they're forged in the darkness of early mornings and late-night grinding. Your time is NOW.`,
            sub: 'Train like an athlete, eat like a champion, sleep like a baby. Dominate. 🏆'
        }
    };
    return msgs[goal] || msgs.general_fitness;
}

// ===== AI Recommendations =====
function getAIRecommendations(data) {
    const { name, age, goal, activity, health, weight, height } = data;
    const bmi = calcBMI(weight, height);
    const recs = [];

    // Sleep
    recs.push({
        icon: '🌙',
        title: 'Sleep Optimization',
        desc: age < 25
            ? `${name}, aim for 8–9 hours of quality sleep. Your body is still developing, and sleep is when muscle repair and growth hormone release peak. Avoid screens 1 hour before bed.`
            : age < 40
            ? `Target 7–8 hours of uninterrupted sleep. Set a consistent sleep schedule — this alone can improve recovery by 40%. Consider magnesium supplementation before bed.`
            : `Prioritize 7–8 hours of sleep. Quality matters more than quantity at your age — use blackout curtains, maintain 65°F (18°C) room temperature, and avoid caffeine after 2 PM.`
    });

    // Hydration
    const water = calcWaterIntake(weight, activity);
    recs.push({
        icon: '💧',
        title: 'Hydration Strategy',
        desc: `Drink at least ${water}L of water daily. Start your morning with 500ml of warm lemon water. ${activity === 'active' || activity === 'extreme' ? 'Add electrolytes during intense workouts to prevent dehydration.' : 'Carry a water bottle everywhere — hydration impacts energy, focus, and metabolism.'}`
    });

    // Consistency
    recs.push({
        icon: '📅',
        title: 'Consistency Blueprint',
        desc: goal === 'weight_loss'
            ? `${name}, sustainable fat loss happens at 0.5–1 kg per week. Don't chase rapid results — they boomerang. Track meals for 2 weeks to build awareness, then shift to intuitive eating.`
            : goal === 'muscle_gain'
            ? `Building muscle takes patience — expect visible changes in 8–12 weeks. Progressive overload is key: increase weight by 2.5% every 2 weeks. Never skip leg day.`
            : `${name}, the magic is in showing up consistently, not perfectly. Schedule your workouts like meetings — non-negotiable. Even 20 minutes counts on tough days.`
    });

    // Health-specific
    if (health !== 'none') {
        const healthRecs = {
            diabetes: { icon: '🩺', title: 'Diabetes Management', desc: `Monitor blood sugar before and after workouts. Prefer low-GI carbs (oats, sweet potatoes, legumes). Time your meals to maintain stable glucose — eat every 3–4 hours. Always keep a fast-acting sugar source during exercise.` },
            hypertension: { icon: '❤️', title: 'Blood Pressure Care', desc: `Focus on the DASH diet approach — rich in fruits, vegetables, whole grains. Limit sodium to <1500mg/day. Moderate-intensity cardio is your best friend for blood pressure control. Avoid heavy lifting with breath-holding (Valsalva maneuver).` },
            thyroid: { icon: '🦋', title: 'Thyroid Support', desc: `Ensure adequate selenium and iodine in your diet (brazil nuts, seafood). Avoid excessive soy and cruciferous vegetables if hypothyroid. Time thyroid medication 4 hours apart from calcium and iron supplements. Regular strength training helps boost metabolism.` },
            pcos: { icon: '🌸', title: 'PCOS-Friendly Approach', desc: `Focus on anti-inflammatory foods and balanced blood sugar. Strength training is particularly beneficial for PCOS — it improves insulin sensitivity. Include inositol-rich foods (citrus, beans). Manage stress with yoga and meditation.` },
            back_pain: { icon: '🦴', title: 'Back-Safe Training', desc: `Always warm up your core before workouts. Avoid heavy deadlifts and loaded spinal flexion. Focus on McGill Big 3 exercises (curl-up, side plank, bird-dog). Strengthen glutes and hamstrings — weak posterior chain often causes back issues.` },
            asthma: { icon: '🫁', title: 'Exercise with Asthma', desc: `Always carry your rescue inhaler during workouts. Warm up for at least 10 minutes to prevent exercise-induced bronchospasm. Prefer nasal breathing and humid environments. Swimming is one of the best exercises for asthma management.` },
            joint_issues: { icon: '🦵', title: 'Joint-Friendly Training', desc: `Prioritize low-impact exercises: swimming, cycling, elliptical. Strengthen muscles around affected joints with isometric exercises. Use glucosamine and omega-3 supplements (consult your doctor). Always warm up thoroughly and never train through sharp joint pain.` }
        };
        if (healthRecs[health]) recs.push(healthRecs[health]);
    }

    // Bonus AI tip
    recs.push({
        icon: '🧠',
        title: 'Mindset & Progress Tracking',
        desc: `${name}, track 3 things weekly: body measurements (not just weight), energy levels, and workout performance. Progress photos monthly beat the scale. ${bmi > 25 ? 'Remember — muscle weighs more than fat. The number on the scale doesn\'t define your progress.' : 'Focus on how you feel and perform, not just how you look.'}`
    });

    return recs;
}

// ===== Lifestyle Tips =====
function getLifestyleTips(goal, activity, health) {
    const tips = [];

    tips.push({ icon: '⏰', text: 'Wake up at a consistent time daily — circadian rhythm impacts metabolism, hormone balance, and recovery efficiency.' });

    if (goal === 'weight_loss') {
        tips.push({ icon: '🍽️', text: 'Practice mindful eating — chew slowly, no screens during meals. This alone can reduce calorie intake by 15–20%.' });
        tips.push({ icon: '🚶', text: 'Aim for 8,000–10,000 steps daily outside of structured workouts. NEAT (non-exercise activity) burns more calories than you think.' });
    } else if (goal === 'muscle_gain') {
        tips.push({ icon: '🥛', text: 'Consume protein within 30 minutes post-workout. Aim for 1.6–2.2g of protein per kg body weight daily.' });
        tips.push({ icon: '😴', text: 'Growth hormone peaks during deep sleep. Minimize blue light exposure and aim for 8 hours to maximize gains.' });
    } else {
        tips.push({ icon: '📱', text: 'Limit screen time before bed to 30 minutes. Blue light disrupts melatonin production and sleep quality.' });
        tips.push({ icon: '🧘', text: 'Dedicate 10 minutes daily to mindfulness or meditation — it reduces cortisol and improves recovery.' });
    }

    if (activity === 'sedentary') {
        tips.push({ icon: '🪑', text: 'Set hourly movement reminders. Even 2-minute walks every hour reduce health risks associated with prolonged sitting.' });
    }

    if (health !== 'none') {
        tips.push({ icon: '📋', text: 'Schedule regular check-ups with your healthcare provider. Share this fitness plan with your doctor for personalized medical advice.' });
    }

    return tips;
}

// ===== Render Results =====
function renderResults(data) {
    const bmi = calcBMI(data.weight, data.height);
    const bmiInfo = bmiCategory(bmi);
    const bmr = calcBMR(data.weight, data.height, data.age, data.gender);
    const tdee = calcTDEE(bmr, data.activity);
    const targetCals = calcTargetCalories(tdee, data.goal);
    const water = calcWaterIntake(data.weight, data.activity);

    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');
    document.getElementById('results-name').textContent = data.name;

    // Set nav active
    document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('nav-results').classList.add('active');

    // 1. Profile Summary
    document.getElementById('profile-body').innerHTML = `
        <div class="profile-summary">
            <div class="profile-item"><div class="profile-item-icon">👤</div><div><div class="profile-item-label">Name</div><div class="profile-item-value">${data.name}</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">🎂</div><div><div class="profile-item-label">Age</div><div class="profile-item-value">${data.age} years</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">⚖️</div><div><div class="profile-item-label">Weight</div><div class="profile-item-value">${data.weight} kg</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">📏</div><div><div class="profile-item-label">Height</div><div class="profile-item-value">${data.height} cm</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">🎯</div><div><div class="profile-item-label">Goal</div><div class="profile-item-value">${goalLabels[data.goal]}</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">⚡</div><div><div class="profile-item-label">Activity</div><div class="profile-item-value">${activityLabels[data.activity]}</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">🍽️</div><div><div class="profile-item-label">Diet</div><div class="profile-item-value">${dietLabels[data.diet]}</div></div></div>
            <div class="profile-item"><div class="profile-item-icon">🏥</div><div><div class="profile-item-label">Health</div><div class="profile-item-value">${healthLabels[data.health]}</div></div></div>
        </div>
    `;

    // 2. Health Insights — Metrics
    const bmiPercent = Math.min((bmi / 40) * 100, 100);
    const calPercent = Math.min((targetCals / 3500) * 100, 100);
    const waterPercent = Math.min((parseFloat(water) / 5) * 100, 100);

    document.getElementById('metrics-grid').innerHTML = `
        <div class="metric-card metric-bmi">
            <div class="metric-label">BMI</div>
            <div class="metric-value">${bmi}</div>
            <div style="font-size:0.8rem;color:${bmiInfo.color};font-weight:600">${bmiInfo.label}</div>
            <div class="metric-bar"><div class="metric-bar-fill" data-width="${bmiPercent}"></div></div>
        </div>
        <div class="metric-card metric-calories">
            <div class="metric-label">Daily Calories</div>
            <div class="metric-value">${targetCals}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary)">kcal/day</div>
            <div class="metric-bar"><div class="metric-bar-fill" data-width="${calPercent}"></div></div>
        </div>
        <div class="metric-card metric-water">
            <div class="metric-label">Water Intake</div>
            <div class="metric-value">${water}L</div>
            <div style="font-size:0.8rem;color:var(--text-secondary)">per day</div>
            <div class="metric-bar"><div class="metric-bar-fill" data-width="${waterPercent}"></div></div>
        </div>
    `;

    // Lifestyle Tips
    const tips = getLifestyleTips(data.goal, data.activity, data.health);
    document.getElementById('lifestyle-tips').innerHTML = `
        <h4>💡 Lifestyle Advice</h4>
        <ul class="tip-list">
            ${tips.map(t => `<li class="tip-item"><span class="tip-icon">${t.icon}</span><span>${t.text}</span></li>`).join('')}
        </ul>
    `;

    // 3. Workout Plan
    const workoutPlan = getWorkoutPlan(data.goal, data.health, data.activity);
    document.getElementById('workout-grid').innerHTML = workoutPlan.map(d => `
        <div class="day-card">
            <div class="day-badge ${d.type === 'rest' ? 'rest-day' : 'workout-day'}">${d.day}</div>
            <div class="day-info">
                <div class="day-name">${d.name}</div>
                <div class="day-exercises">${d.exercises}</div>
            </div>
            <span class="day-tag tag-${d.type}">${d.tag}</span>
        </div>
    `).join('');

    // 4. Nutrition Plan
    const meals = getNutritionPlan(data.goal, data.diet, targetCals, data.health);
    const mealIcons = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };
    const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Evening Snack', dinner: 'Dinner' };

    document.getElementById('meals-grid').innerHTML = Object.entries(meals).map(([key, meal]) => `
        <div class="meal-card">
            <div class="meal-header">
                <span class="meal-icon">${mealIcons[key]}</span>
                <span class="meal-name">${mealNames[key]}</span>
                <span class="meal-time">${meal.time}</span>
            </div>
            <ul class="meal-items">
                ${meal.items.map(item => `<li class="meal-item">${item}</li>`).join('')}
            </ul>
            <div class="meal-macros">
                <span class="macro-pill macro-protein">🥩 Protein: ${meal.macros.protein}</span>
                <span class="macro-pill macro-carbs">🌾 Carbs: ${meal.macros.carbs}</span>
                <span class="macro-pill macro-fats">🥑 Fats: ${meal.macros.fats}</span>
            </div>
        </div>
    `).join('');

    // 5. Motivation
    const motivation = getMotivation(data.name, data.goal);
    document.getElementById('motivation-body').innerHTML = `
        <div class="motivation-quote">${motivation.quote}</div>
        <div class="motivation-subtext">${motivation.sub}</div>
    `;

    // 6. AI Recommendations
    const recs = getAIRecommendations(data);
    document.getElementById('ai-body').innerHTML = `
        <div class="ai-rec-list">
            ${recs.map(r => `
                <div class="ai-rec-item">
                    <div class="ai-rec-icon">${r.icon}</div>
                    <div class="ai-rec-content">
                        <div class="ai-rec-title">${r.title}</div>
                        <div class="ai-rec-desc">${r.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Animate metric bars
    setTimeout(() => {
        document.querySelectorAll('.metric-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
    }, 500);

    // Re-trigger animations
    document.querySelectorAll('.animate-in').forEach((el, i) => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = `fadeInUp 0.6s ease ${i * 0.1}s forwards`;
    });

    // Store data for download
    window.__fitData = data;
    window.__fitMetrics = { bmi, bmiInfo, bmr, tdee, targetCals, water };
}

// ===== Edit Plan =====
function editPlan() {
    document.getElementById('results-section').classList.add('hidden');
    document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.nav-pill[data-target="form-section"]').classList.add('active');
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// ===== Download Plan =====
function downloadPlan() {
    const data = window.__fitData;
    const m = window.__fitMetrics;
    if (!data) return;

    const workoutPlan = getWorkoutPlan(data.goal, data.health, data.activity);
    const meals = getNutritionPlan(data.goal, data.diet, m.targetCals, data.health);
    const motivation = getMotivation(data.name, data.goal);
    const recs = getAIRecommendations(data);
    const tips = getLifestyleTips(data.goal, data.activity, data.health);
    const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Evening Snack', dinner: 'Dinner' };

    let text = `
╔══════════════════════════════════════════════════════════╗
║           FitGenius AI — Personalized Fitness Plan        ║
╚══════════════════════════════════════════════════════════╝

Generated: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PROFILE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:           ${data.name}
Age:            ${data.age} years
Weight:         ${data.weight} kg
Height:         ${data.height} cm
Goal:           ${goalLabels[data.goal]}
Activity Level: ${activityLabels[data.activity]}
Diet:           ${dietLabels[data.diet]}
Health:         ${healthLabels[data.health]}
Gender:         ${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 HEALTH INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BMI:              ${m.bmi} (${m.bmiInfo.label})
Daily Calories:   ${m.targetCals} kcal
Water Intake:     ${m.water}L per day

Lifestyle Tips:
${tips.map(t => `  ${t.icon} ${t.text}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️ WEEKLY WORKOUT PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${workoutPlan.map(d => `
  ${d.name} [${d.tag.toUpperCase()}]
  ${d.exercises}
`).join('')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥗 DAILY NUTRITION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(meals).map(([key, meal]) => `
  ${mealNames[key]} (${meal.time})
  ${meal.items.filter(i => !i.startsWith('⚠️')).map(i => `    • ${i}`).join('\n')}
  Macros: Protein ${meal.macros.protein} | Carbs ${meal.macros.carbs} | Fats ${meal.macros.fats}
`).join('')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 MOTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${motivation.quote}"

${motivation.sub}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 AI SMART RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${recs.map(r => `
  ${r.icon} ${r.title}
  ${r.desc}
`).join('')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Disclaimer: This plan is AI-generated and for informational purposes only.
Consult a healthcare professional before starting any fitness or diet program.

Powered by FitGenius AI © 2026
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitGenius_Plan_${data.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
