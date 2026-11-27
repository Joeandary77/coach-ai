import type {
  AgeCategory,
  Equipment,
  Exercise,
  ExerciseDifficulty,
  FitnessFocus,
} from "@/types/fitness";

const all: AgeCategory[] = ["U8", "U10", "U12", "U14"];
const older: AgeCategory[] = ["U12", "U14"];

interface RichExerciseSpec {
  id: string;
  name: string;
  description: string;
  focus: FitnessFocus[];
  equipment: Equipment[];
  suitableCategories?: AgeCategory[];
  difficulty?: ExerciseDifficulty;
  instructions: string[];
  coachingNotes: string[];
}

function buildExercise(spec: RichExerciseSpec): Exercise {
  return {
    id: spec.id,
    name: spec.name,
    description: spec.description,
    focus: spec.focus,
    equipment: spec.equipment,
    suitableCategories: spec.suitableCategories ?? all,
    difficulty: spec.difficulty ?? "Beginner",
    instructions: spec.instructions,
    coachingNotes: spec.coachingNotes,
  };
}

const rawAdditionalExercises: RichExerciseSpec[] = [
  // AGILITY
  {
    id: "cone-weaving",
    name: "Cone Weaving",
    description:
      "Slalom footwork through a line of spaced cones to build sharp hip control and deceleration.",
    focus: ["Agility", "Coordination"],
    equipment: ["Cones"],
    instructions: [
      "Place 6 to 8 cones in a straight line spaced 1.5 meters apart.",
      "Jog or quick-step in and out around each cone, keeping hips low on every turn.",
      "Walk back around the outside of the line to recover before the next repetition.",
    ],
    coachingNotes: [
      "Plant the outside foot firmly rather than leaning the upper body.",
      "Start at 70% speed until foot placement around each cone is clean.",
    ],
  },
  {
    id: "two-foot-ladder",
    name: "Two-Foot Ladder Steps",
    description:
      "Rhythmic two-feet-in ladder stepping to develop quick ground contact and body control.",
    focus: ["Agility", "Coordination"],
    equipment: ["Agility ladder"],
    instructions: [
      "Stand facing the agility ladder with knees slightly bent and arms ready.",
      "Step both feet into the first square (left-right), then advance quickly to the next square.",
      "Keep eyes forward rather than staring straight down at the rungs.",
    ],
    coachingNotes: [
      "Use quiet, light foot contacts on the balls of the feet.",
      "Keep the ladder flat on the floor and leave 2 squares between players.",
    ],
  },
  {
    id: "lateral-ladder",
    name: "Lateral Ladder Steps",
    description:
      "Sideways two-feet-in ladder movement mimicking defensive court slides without crossing feet.",
    focus: ["Agility", "Coordination"],
    equipment: ["Agility ladder"],
    instructions: [
      "Stand sideways next to the first square of the agility ladder in an athletic stance.",
      "Step the lead foot then trail foot into each square moving laterally down the ladder.",
      "Face the same direction on the return trip so both sides lead equally.",
    ],
    coachingNotes: [
      "Do not allow the feet to click together or cross over.",
      "Keep hips level and avoid bouncing upward between squares.",
    ],
  },
  {
    id: "red-light-green-light",
    name: "Red Light, Green Light",
    description:
      "Reactive sprint-and-stop game that trains sudden braking and athletic balance.",
    focus: ["Agility", "Coordination"],
    equipment: ["Cones"],
    instructions: [
      "Line players up along a baseline cone line facing the coach 15 meters away.",
      "On 'Green Light', players move forward; on 'Red Light', everyone freezes in a balanced athletic stance.",
      "Reset gently if a player loses balance, focusing on clean two-foot stops.",
    ],
    coachingNotes: [
      "Cue players to drop their hips and bend their knees on every stop.",
      "Vary the movement style: brisk walk, skip, side shuffle, or light jog.",
    ],
  },
  {
    id: "whistle-freeze",
    name: "Whistle Freeze",
    description:
      "Multi-directional movement drill with instant auditory reaction and single- or two-foot stabilization.",
    focus: ["Agility", "Coordination"],
    equipment: ["Whistle"],
    instructions: [
      "Players jog, skip, or side-shuffle freely inside a marked court zone.",
      "On one short whistle blast, every player freezes in a low defensive stance for 2 seconds.",
      "Resume moving on the coach's verbal cue, changing movement patterns each round.",
    ],
    coachingNotes: [
      "Keep plenty of open court space so players never collide on a freeze.",
      "Praise quiet, stable landings over rushing.",
    ],
  },
  {
    id: "partner-mirror",
    name: "Partner Mirror",
    description:
      "Reactive lateral shadowing drill between pairs to build defensive footwork anticipation.",
    focus: ["Agility", "Coordination"],
    equipment: [],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Pairs face each other 2 meters apart along a 5-meter court lane.",
      "One partner leads with lateral slides and direction changes while the other mirrors immediately.",
      "Work for 15 to 20 seconds, rest 25 seconds, then switch roles.",
    ],
    coachingNotes: [
      "Keep bouts short so defensive posture stays sharp throughout.",
      "Remind the shadow partner to watch the leader's hips, not their head.",
    ],
  },
  {
    id: "square-cone",
    name: "Square Cone Drill",
    description:
      "Four-cone box pattern combining forward sprint, lateral shuffle, backpedal, and plant.",
    focus: ["Agility"],
    equipment: ["Cones"],
    instructions: [
      "Set 4 cones in a 4m x 4m square.",
      "Sprint forward to cone 2, side-shuffle to cone 3, backpedal under control to cone 4, and shuffle to start.",
      "Alternate clockwise and counter-clockwise directions on each repetition.",
    ],
    coachingNotes: [
      "Stay low during the backpedal with weight slightly forward.",
      "Round the corners smoothly rather than twisting the knees.",
    ],
  },
  {
    id: "hoop-steps",
    name: "Hoop Stepping",
    description:
      "Targeted foot-placement path through floor hoops to improve stride accuracy and rhythm.",
    focus: ["Coordination", "Balance"],
    equipment: ["Hula hoops"],
    instructions: [
      "Arrange 6 hula hoops in a staggered zigzag path on the floor.",
      "Step cleanly into the center of each hoop with alternating feet, pausing briefly on the final hoop.",
      "Walk back to the start line and repeat with the opposite lead foot.",
    ],
    coachingNotes: [
      "Ensure hoops lie flat and non-slip on the gym surface.",
      "Focus on soft, controlled landings inside each target.",
    ],
  },

  // STRENGTH
  {
    id: "squat-reach",
    name: "Squat and Reach",
    description:
      "Bodyweight squat paired with an overhead arm reach to build leg strength and thoracic extension.",
    focus: ["Strength", "Coordination"],
    equipment: [],
    instructions: [
      "Stand with feet shoulder-width apart and arms relaxed at the sides.",
      "Sit hips back into a comfortable squat while reaching both arms straight overhead.",
      "Stand back up smoothly and lower arms to the starting position for 8 to 10 reps.",
    ],
    coachingNotes: [
      "Keep heels flat on the floor and chest proud throughout the squat.",
      "Use a shallow range of motion if players struggle to keep their back straight.",
    ],
  },
  {
    id: "squat-calf-raise",
    name: "Squat and Calf Raise",
    description:
      "Combined lower-body squat and ankle plantarflexion to strengthen jumping and landing mechanics.",
    focus: ["Strength", "Balance"],
    equipment: [],
    instructions: [
      "Perform a controlled bodyweight squat with feet hip-to-shoulder width apart.",
      "As you stand up, rise smoothly onto the balls of both feet for a 1-second calf raise.",
      "Lower heels slowly to the floor before starting the next repetition (8 to 10 reps).",
    ],
    coachingNotes: [
      "Control the descent of the heels rather than dropping quickly.",
      "Keep ankles aligned straight ahead without rolling outward.",
    ],
  },
  {
    id: "reverse-lunge",
    name: "Reverse Lunge",
    description:
      "Controlled backward stepping lunge that builds single-leg stability with minimal knee stress.",
    focus: ["Strength", "Balance"],
    equipment: [],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Stand tall with hands on hips or arms held forward for balance.",
      "Step one foot straight back and lower both knees toward a comfortable 90-degree angle.",
      "Push through the front heel to return to standing, alternating legs for 6 to 8 reps per side.",
    ],
    coachingNotes: [
      "Keep the front knee tracking over the middle toes.",
      "Avoid letting the back knee slam into the gym floor.",
    ],
  },
  {
    id: "split-squat",
    name: "Split Squat",
    description:
      "Stationary split-stance squat developing unilateral leg strength and hip balance.",
    focus: ["Strength", "Balance"],
    equipment: [],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Take a comfortable stride forward and hold a stationary split stance.",
      "Lower the back knee straight down under control, keeping the torso upright.",
      "Press through the front foot to return to the top for 6 to 8 reps, then switch legs.",
    ],
    coachingNotes: [
      "Widen the stance slightly side-to-side if balance feels shaky.",
      "Keep weight evenly distributed between front foot and back toes.",
    ],
  },
  {
    id: "modified-push-up",
    name: "Modified Push-Up",
    description:
      "Knee-supported push-up progression teaching straight-line core tension and upper-body control.",
    focus: ["Strength"],
    equipment: ["Exercise mats"],
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Kneel on an exercise mat and place hands slightly wider than shoulder width.",
      "Form a straight line from head to knees, lower the chest slowly toward the mat, and press back up.",
      "Perform 6 to 8 clean repetitions with full control.",
    ],
    coachingNotes: [
      "Keep elbows angled roughly 45 degrees from the torso rather than flared wide.",
      "Stop the set as soon as the lower back begins to sag.",
    ],
  },
  {
    id: "push-up",
    name: "Push-Up",
    description:
      "Full plank-position push-up for upper-body pressing strength and trunk stability.",
    focus: ["Strength"],
    equipment: ["Exercise mats"],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Start in a high plank on a mat with hands under shoulders and legs extended.",
      "Brace the core, lower the chest smoothly toward the floor, and push back to full arm extension.",
      "Complete 6 to 10 controlled reps, substituting modified push-ups if form fades.",
    ],
    coachingNotes: [
      "Maintain a neutral neck looking slightly ahead of the fingertips.",
      "Quality of every repetition matters far more than total count.",
    ],
  },
  {
    id: "plank",
    name: "Plank",
    description:
      "Isometric forearm hold building trunk endurance to protect posture during basketball contact.",
    focus: ["Strength", "Balance"],
    equipment: ["Exercise mats"],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Support your body on forearms and toes over an exercise mat with elbows under shoulders.",
      "Squeeze glutes and gently brace the abdominals to keep hips level with shoulders.",
      "Hold for 15 to 25 seconds while breathing steadily, then rest.",
    ],
    coachingNotes: [
      "Never encourage breath-holding; cue slow, steady breaths.",
      "Drop to knees immediately if hips pike up or sag down.",
    ],
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    description:
      "Static wall-supported squat hold building isometric quadriceps endurance for low defensive stances.",
    focus: ["Strength"],
    equipment: ["Wall"],
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Lean your back flat against a clear gym wall and walk feet forward.",
      "Slide down until knees are bent at a comfortable angle (45 to 90 degrees) with heels planted.",
      "Hold for 15 to 25 seconds with hands resting off the thighs, then stand and shake out legs.",
    ],
    coachingNotes: [
      "Ensure players do not push down on their knees with their hands.",
      "Use a higher knee angle for younger players or early weeks.",
    ],
  },
  {
    id: "shoulder-taps",
    name: "Shoulder Taps",
    description:
      "Anti-rotation high-plank drill challenging core stability and upper-body support.",
    focus: ["Strength", "Coordination"],
    equipment: ["Exercise mats"],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Hold a high plank on a mat with feet placed slightly wider than shoulder width.",
      "Slowly lift one hand to tap the opposite shoulder without letting the hips twist.",
      "Return the hand to the mat and alternate sides for 6 to 8 taps per arm.",
    ],
    coachingNotes: [
      "Imagine balancing a cup of water on the lower back so hips stay still.",
      "Move slowly—rushing turns this into momentum instead of stability.",
    ],
  },

  // COORDINATION AND BALANCE
  {
    id: "soft-ball-catch",
    name: "Soft-Ball Catch",
    description:
      "Two-hand and one-hand foam/soft-ball catching to build hand-eye tracking without fear of impact.",
    focus: ["Coordination"],
    equipment: ["Soft balls"],
    instructions: [
      "Pairs stand 2 to 3 meters apart holding a lightweight foam or soft ball.",
      "Toss underhand with a gentle arc; the partner watches the ball all the way into soft hands.",
      "Progress to clapping once before catching as confidence grows.",
    ],
    coachingNotes: [
      "Use lightweight foam/soft balls only—never regulation basketballs in fitness blocks.",
      "Cue players to keep thumbs and fingers relaxed and ready.",
    ],
  },
  {
    id: "tennis-ball-catch",
    name: "Tennis-Ball Catch",
    description:
      "Small-ball hand-eye coordination drill sharpening visual tracking and soft-hand reception.",
    focus: ["Coordination"],
    equipment: ["Tennis balls"],
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Pairs stand 3 meters apart and toss a tennis ball underhand at chest height.",
      "Catch cleanly with the right hand, toss back, then repeat with the left hand.",
      "Keep knees softly bent in an athletic ready position between throws.",
    ],
    coachingNotes: [
      "Give both hands equal repetitions.",
      "Keep throws accurate and friendly rather than hard.",
    ],
  },
  {
    id: "bounce-catch",
    name: "Bounce and Catch",
    description:
      "Reactive bounce-pass tracking drill pairing low stance readiness with clean hand coordination.",
    focus: ["Coordination"],
    equipment: ["Tennis balls"],
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Pairs stand 3 meters apart with one tennis ball.",
      "Bounce the ball cleanly halfway between partners so it rises to waist height for a one-hand catch.",
      "Alternate right-hand and left-hand catches for 10 repetitions each.",
    ],
    coachingNotes: [
      "Stay low in an athletic stance rather than bending over at the waist.",
      "Adjust spacing if the gym floor has a lively bounce.",
    ],
  },
  {
    id: "single-leg-reach",
    name: "Single-Leg Reach",
    description:
      "Dynamic single-leg balance drill reaching toward floor markers in three directions.",
    focus: ["Balance", "Coordination"],
    equipment: ["Floor markers"],
    suitableCategories: ["U10", "U12", "U14"],
    instructions: [
      "Place 3 floor markers in a semi-circle roughly 50 cm in front and to the sides of the player.",
      "Stand on one leg with a slightly bent knee and reach the free foot gently to tap each marker.",
      "Complete 2 rounds per standing leg without touching the free foot down between taps.",
    ],
    coachingNotes: [
      "Keep the standing knee aligned over the foot without caving inward.",
      "Bring markers closer for players who need extra stability.",
    ],
  },
  {
    id: "hoop-freeze",
    name: "Hoop Step and Freeze",
    description:
      "Hop-and-hold balance drill inside floor hoops to reinforce quiet, stable landing posture.",
    focus: ["Balance", "Coordination"],
    equipment: ["Hula hoops"],
    instructions: [
      "Scatter hula hoops safely across the floor with 1.5 meters between hoops.",
      "Players step or small-hop into a hoop and freeze on one or two feet for 3 full seconds.",
      "Move smoothly to the next open hoop once balance is completely still.",
    ],
    coachingNotes: [
      "Count '1-2-3' aloud together on every freeze to prevent rushing.",
      "Encourage soft, quiet landings with bent knees.",
    ],
  },
  {
    id: "alternating-hand-catch",
    name: "Alternating-Hand Catch",
    description:
      "Two-ball or alternating-hand toss drill demanding split-second visual focus and bilateral control.",
    focus: ["Coordination"],
    equipment: ["Soft balls"],
    suitableCategories: older,
    difficulty: "Intermediate",
    instructions: [
      "Pairs stand 2.5 meters apart with one soft ball.",
      "On the thrower's call ('Right!' or 'Left!'), the catcher secures the ball with the named hand.",
      "Perform 10 catches per player, then switch roles.",
    ],
    coachingNotes: [
      "Call the target hand just as the ball leaves the thrower's hand.",
      "Keep the atmosphere playful and supportive.",
    ],
  },

  // MOVEMENT GAMES
  {
    id: "treasure-hunt",
    name: "Cone Treasure Hunt",
    description:
      "Cooperative team collection game combining light aerobic movement with spatial awareness.",
    focus: ["Coordination", "Endurance"],
    equipment: ["Cones"],
    instructions: [
      "Scatter small cones across half the court and assign teams a home base.",
      "Players jog out one at a time, pick up a single cone, and place it neatly at their team base.",
      "Continue until all cones are collected, then reset cooperatively.",
    ],
    coachingNotes: [
      "Keep movement to a controlled jog with heads up to avoid collisions.",
      "Celebrate teamwork and cheering rather than winners and losers.",
    ],
  },
  {
    id: "cone-relay",
    name: "Cooperative Cone Relay",
    description:
      "Continuous relay game practicing multi-directional locomotion and smooth teammate handoffs.",
    focus: ["Coordination", "Endurance"],
    equipment: ["Cones"],
    instructions: [
      "Divide players into small lines of 3 to 4 behind a start cone facing a turnaround cone 10 meters away.",
      "Players perform the assigned movement (skip, side shuffle, or jog) around the far cone and tag the next teammate.",
      "Run for 60 to 90 seconds per round with generous rest between rounds.",
    ],
    coachingNotes: [
      "Keep teams small (max 4 players) so nobody stands waiting long.",
      "Focus on clean turns around the far cone.",
    ],
  },
  {
    id: "obstacle-course",
    name: "Easy Obstacle Course",
    description:
      "Multi-station movement circuit linking ladder steps, hoop landings, and cone weaves.",
    focus: ["Agility", "Coordination"],
    equipment: ["Cones", "Agility ladder", "Hula hoops"],
    instructions: [
      "Set a continuous loop: agility ladder steps -> 4 hula hoop balance steps -> 5-cone slalom weave.",
      "Players enter the course spaced 3 seconds apart and move through at a steady, controlled pace.",
      "Walk back along the sideline to recover before the next lap.",
    ],
    coachingNotes: [
      "Walk through the entire course once together before starting.",
      "Emphasize clean footwork at every station rather than racing.",
    ],
  },
  {
    id: "movement-circuit",
    name: "Easy Movement Circuit",
    description:
      "Four-corner station rotation alternating light locomotor skills and balance holds.",
    focus: ["Coordination", "Endurance"],
    equipment: ["Cones", "Floor markers"],
    instructions: [
      "Mark 4 corners of half court with cones and floor markers.",
      "Assign a different movement per side: side shuffle, high-knee march, backward walk, and light skip.",
      "Rotate continuously for 90 seconds, then pause for water and breathing recovery.",
    ],
    coachingNotes: [
      "Keep intensity conversational so players finish energized, not exhausted.",
      "Reverse direction on the second round.",
    ],
  },
  {
    id: "animal-movement",
    name: "Animal Movement Game",
    description:
      "Playful whole-body locomotion (bear walk, frog hop, crab walk) building coordination and core strength.",
    focus: ["Coordination"],
    equipment: [],
    instructions: [
      "Mark a 6-to-8-meter lane across the court.",
      "Call out an animal movement (bear walk, crab walk, bunny hop) for players to perform across the lane.",
      "Stand up and walk back slowly between each short crossing.",
    ],
    coachingNotes: [
      "Keep crossings short (6 to 8 meters) to protect wrists and shoulders.",
      "Best suited for younger groups or light warm-up energy.",
    ],
  },

  // MOBILITY
  {
    id: "butterfly-stretch",
    name: "Butterfly Stretch",
    description:
      "Seated inner-thigh and groin stretch helping hips relax after lateral court shuffling.",
    focus: ["Mobility"],
    equipment: ["Exercise mats"],
    instructions: [
      "Sit tall on an exercise mat and bring the soles of both feet together.",
      "Hold the ankles gently, lengthen the spine, and let the knees relax toward the floor.",
      "Hold comfortably for 20 to 30 seconds while breathing deeply.",
    ],
    coachingNotes: [
      "Never bounce the knees up and down or push them down with hands.",
      "Keep the back tall rather than rounding forward.",
    ],
  },
  {
    id: "hip-circles",
    name: "Hip Circles",
    description:
      "Standing controlled hip rotations to lubricate the hip joints before or after practice.",
    focus: ["Mobility"],
    equipment: [],
    instructions: [
      "Stand tall with hands on hips and feet slightly wider than shoulder width.",
      "Draw slow, smooth circles with the hips—5 circles clockwise, then 5 counter-clockwise.",
      "Keep knees soft and shoulders steady throughout.",
    ],
    coachingNotes: [
      "Move slowly through comfortable ranges without forcing.",
      "Great transition movement before static stretching.",
    ],
  },
  {
    id: "knee-hugs",
    name: "Knee Hugs",
    description:
      "Standing single-leg knee-to-chest pull combining hip mobility with single-leg balance.",
    focus: ["Mobility", "Balance"],
    equipment: [],
    instructions: [
      "Stand tall, lift one knee toward the chest, and hug the shin gently with both hands.",
      "Pause for 2 seconds in tall posture, lower the foot, and switch sides.",
      "Complete 5 slow repetitions per leg.",
    ],
    coachingNotes: [
      "Stand near a wall for light fingertip support if balance is still developing.",
      "Avoid leaning backward as the knee comes up.",
    ],
  },
  {
    id: "calf-stretch",
    name: "Calf Stretch",
    description:
      "Split-stance heel-down calf stretch relieving lower-leg tightness from running and jumping.",
    focus: ["Mobility"],
    equipment: [],
    instructions: [
      "Step one foot back into a comfortable stride with both toes pointing straight ahead.",
      "Keep the back leg straight and press the back heel gently toward the floor while bending the front knee.",
      "Hold for 20 to 25 seconds per leg.",
    ],
    coachingNotes: [
      "Ensure the back foot stays pointing forward rather than turning outward.",
      "Stretch to mild tension, never sharp discomfort.",
    ],
  },
  {
    id: "hamstring-stretch",
    name: "Hamstring Stretch",
    description:
      "Gentle heel-out hamstring hinge to release tension along the back of the thighs.",
    focus: ["Mobility"],
    equipment: [],
    instructions: [
      "Place one heel slightly forward on the floor with that leg straight and toes relaxed.",
      "Bend the supporting knee slightly and hinge forward at the hips with a flat back.",
      "Hold for 20 seconds per side while breathing calmly.",
    ],
    coachingNotes: [
      "Keep hands resting on the bent thigh—never press directly on the straight knee.",
      "Stop at mild stretch sensation.",
    ],
  },
  {
    id: "hip-flexor-stretch",
    name: "Hip Flexor Stretch",
    description:
      "Half-kneeling front-hip stretch counteracting prolonged sitting and forward athletic posture.",
    focus: ["Mobility"],
    equipment: ["Exercise mats"],
    instructions: [
      "Kneel with one knee padded on an exercise mat and the other foot planted flat in front.",
      "Gently tuck the hips under and shift slightly forward until a mild stretch is felt in the front hip.",
      "Hold for 20 seconds per side with upright posture.",
    ],
    coachingNotes: [
      "Avoid overarching the lower back to fake extra depth.",
      "Use a folded mat under the back knee for comfort.",
    ],
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Mobility",
    description:
      "Quadruped spinal flexion and extension flow easing upper- and lower-back stiffness.",
    focus: ["Mobility"],
    equipment: ["Exercise mats"],
    instructions: [
      "Start on hands and knees on an exercise mat with wrists under shoulders and knees under hips.",
      "Inhale as you gently drop the belly and lift the chest; exhale as you round the upper back smoothly.",
      "Flow slowly for 6 to 8 breath-led cycles.",
    ],
    coachingNotes: [
      "Keep movements slow, smooth, and pain-free.",
      "Encourage players to match each movement to a calm breath.",
    ],
  },
  {
    id: "thoracic-rotation",
    name: "Thoracic Rotation",
    description:
      "Upper-back rotational mobility drill improving shoulder freedom and posture.",
    focus: ["Mobility"],
    equipment: ["Exercise mats"],
    instructions: [
      "Start on hands and knees on a mat and place one hand lightly behind your head.",
      "Rotate that elbow down toward the opposite arm, then open the chest smoothly toward the ceiling.",
      "Perform 5 slow repetitions per side.",
    ],
    coachingNotes: [
      "Keep hips still so the rotation comes from the upper back, not the lower back.",
      "Move only as far as comfortable without forcing.",
    ],
  },
  {
    id: "side-reaches",
    name: "Side Reaches",
    description:
      "Standing overhead lateral reach lengthening the sides of the torso and shoulders.",
    focus: ["Mobility"],
    equipment: [],
    instructions: [
      "Stand with feet shoulder-width apart and reach one arm straight overhead.",
      "Lean gently to the opposite side until feeling a light stretch along the ribs.",
      "Hold for 10 to 15 seconds, return to center, and repeat on the other side.",
    ],
    coachingNotes: [
      "Avoid twisting forward or backward during the side bend.",
      "Keep knees soft and breathing relaxed.",
    ],
  },
  {
    id: "full-body-mobility",
    name: "Guided Full-Body Mobility",
    description:
      "Coach-led head-to-toe cool-down routine bringing heart rate down while restoring joint range.",
    focus: ["Mobility", "Recovery"],
    equipment: [],
    instructions: [
      "Gather players in a relaxed circle with plenty of arm space.",
      "Lead 15 to 20 seconds each of shoulder rolls, side reaches, hip circles, hamstring hinges, and calf stretches.",
      "Finish with 3 slow group breaths and a water reminder.",
    ],
    coachingNotes: [
      "Use this time to review one positive takeaway from the session.",
      "Keep the tone calm and unhurried.",
    ],
  },
];

export const additionalExercises: Exercise[] =
  rawAdditionalExercises.map(buildExercise);