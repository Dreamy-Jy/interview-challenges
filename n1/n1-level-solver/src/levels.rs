use serde::Deserialize;
use std::{
    collections::{BTreeMap, HashMap, HashSet, VecDeque},
    fs,
    io::{Error, ErrorKind},
};

/// This module contains all types and functions relating to the game levels.
///
/// Todo:
/// - Talk about the differences between the BFS and A* algorithms.
/// - Talk about the differences between the Manhattan and Euclidean distances.
/// - Rework the Types: set program invariants, and be idomatic.
/// - Add Tests
/// - custom debug and display implementations for the types.
/// - create a replay UI to watch the algos work.

#[derive(Debug, Deserialize, Eq, PartialEq, Hash, PartialOrd, Clone, Ord)]
pub struct Position {
    /// 0 to 44 ints representing the position on the board.
    pub x: u8,
    pub y: u8,
}

impl Position {
    fn coordinate_as_i32(&self) -> (i32, i32) {
        let x = box 6;
        (self.x as i32, self.y as i32)
    }

    /// Calculate the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between two positions.
    ///
    /// Caution: Be wary of overflow (I hit overflow, this needs to be reworked)
    /// Idea: can a language have overflow detection?
    pub fn euclidean_distance(&self, other: &Position) -> u32 {
        let (sx, sy) = self.coordinate_as_i32();
        let (ox, oy) = other.coordinate_as_i32();

        (((sx - ox).pow(2) + (sy - oy).pow(2)) as u32).isqrt()
    }

    /// Calculate the [Manhattan distance](https://simple.wikipedia.org/wiki/Manhattan_distance) between two positions.
    ///
    /// Caution: Be wary of overflow
    pub fn _manhattan_distance(&self, _other: &Position) -> u8 {
        todo!();
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Level {
    pub board: Vec<Vec<char>>, // 2D grid of ".", "A", "W", "P" characters representing the game board.
    pub level: u16,            // value from 1 to 100, representing the level number.
    pub board_size: u8,        // value from 5 to 45 represent the side length of the square board.
    pub player_position: Position,
    pub apple_position: Position,
    walls: HashSet<Position>,
}

pub type Levels = BTreeMap<u16, Level>;

#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Path {
    // level: u16,
    steps: VecDeque<Position>,
    commands: String, // probably should be it's own type, to enforce character limitations
}

impl Path {
    pub fn new(startng_point: Position) -> Self {
        Path {
            steps: VecDeque::from([startng_point.clone()]),
            commands: String::new(),
        }
    }

    pub fn len(&self) -> usize {
        self.steps.len()
    }

    /// Add a step to the path. If the step is valid.
    ///
    /// Todo:
    /// - move the validition map to a higher level type, and accept it as a parameter.
    pub fn take_step(&mut self, next_position: Position) -> Result<(), Error> {
        assert!(
            self.steps.len() > 0,
            "Path should not be empty before taking a step"
        );

        let valid: HashMap<(i8, i8), char> =
            HashMap::from([((-1, 0), 'W'), ((0, -1), 'A'), ((1, 0), 'S'), ((0, 1), 'D')]);

        let Position { x: cx, y: cy } = *self.location();
        let Position { x: nx, y: ny } = next_position;

        match (ny as i8 - cy as i8, nx as i8 - cx as i8) {
            (dy, dx) if valid.contains_key(&(dy, dx)) => {
                self.steps.push_back(next_position);
                self.commands.push(valid[&(dy, dx)]);
                Ok(())
            }
            _ => Err(Error::new(ErrorKind::InvalidInput, "Invalid step taken")),
        }
    }

    pub fn has_not_taken_step(&self, next_position: &Position) -> bool {
        !self.steps.contains(next_position)
    }

    pub fn location(&self) -> &Position {
        self.steps.back().expect("Path should not be empty")
    }

    pub fn as_commands(&self) -> String {
        self.commands.clone()
    }
}

pub fn get_levels() -> Levels {
    let levels_json = include_bytes!("../../data/levels.json");
    let levels: Levels = serde_json::from_slice(levels_json).expect("Failed to parse levels JSON");
    levels
}

/// Save the solution to a json file.
pub fn save_level_solutions(solutions: BTreeMap<u16, String>) {
    let solutions_as_bytes =
        serde_json::to_vec_pretty(&solutions).expect("Failed to serialize level solutions");
    fs::write("../data/solutions.better.json", solutions_as_bytes)
        .expect("Failed to write level solutions to file");
}

// pub fn play_level(level: Level, solution: String) {
//     todo!()
// }
