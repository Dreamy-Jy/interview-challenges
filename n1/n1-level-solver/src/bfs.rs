use std::{
    cmp::Reverse,
    collections::{BTreeMap, BinaryHeap, VecDeque},
};

use crate::levels::{self, Level, Levels, Path, Position};

pub fn generate_all_solutions(levels: &Levels) -> BTreeMap<u16, String> {
    // let mut solutions = BTreeMap::new();
    let mut solutions2 = BTreeMap::new();
    for level in levels.values() {
        let solution = solve_level_better_bfs(&level);

        if let None = solution {
            println!("No solution found for level {}", level.level);
            continue;
        } else if let Some(s) = solution {
            solutions2.insert(level.level, s.as_commands());
        }
    }

    // for level in levels.values() {
    //     let solution = solve_level_bfs(level);
    //     if let None = solution {
    //         println!("No solution found for level {}", level.level);
    //         continue;
    //     } else if let Some(s) = solution {
    //         solutions.insert(level.level, s.as_commands());
    //     }
    // }

    solutions2
}

/// Implement BFS algorithm to find the solution for the given level.
/// This is a naive implementation that return the first path found, not the optimal one.
///
///
/// Todo:
/// - doing everything with references to learn lifetime management.
/// - create a path struct to enforce invariants. (all positions are 1 step away from each other, no walls in between, bind a path to a level, etc.)
///   - Have custom debug and display implementations for the path struct.
fn solve_level_bfs(level: &Level) -> Option<Path> {
    let board = &level.board;

    let mut paths: VecDeque<Path> = VecDeque::new();
    paths.push_back(Path::new(level.player_position.clone()));

    loop {
        if paths.is_empty() {
            break;
        }

        let path = paths.pop_front().unwrap();
        let curr_end = path.location();

        if curr_end == &level.apple_position {
            return Some(path);
        }

        let neighbors = get_valid_neighbors(curr_end, level.board_size, board);

        for neighbor in neighbors {
            let mut new_path = path.clone();
            if new_path.has_not_taken_step(&neighbor) {
                new_path.take_step(neighbor).unwrap();
                paths.push_front(new_path);
            }
        }
    }

    None
}

#[derive(Debug, Eq, PartialEq)]
struct PathWithCost {
    path: Path,
    cost: i32,
}

impl Ord for PathWithCost {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        // Prioritize by cost first, then by path length
        self.cost
            .cmp(&other.cost)
            .then_with(|| self.path.len().cmp(&other.path.len()))
    }
}

impl PartialOrd for PathWithCost {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

type MinHeap<T> = BinaryHeap<Reverse<T>>;

/// BFS implementation, that uses distance and path-length-as-cost heuristics to find the optimal path quickly
/// It could use heuristics, priority queues, or other optimizations.
fn solve_level_better_bfs(level: &Level) -> Option<Path> {
    let board = &level.board;
    let player = &level.player_position;
    let apple = &level.apple_position;

    let mut priortized_paths: MinHeap<PathWithCost> = BinaryHeap::new();
    priortized_paths.push(Reverse(PathWithCost {
        path: Path::new(player.clone()),
        cost: player.euclidean_distance(&apple) as i32,
    }));

    loop {
        if priortized_paths.is_empty() {
            break;
        }

        let Reverse(PathWithCost { path, cost: _ }) = priortized_paths.pop().unwrap();
        let curr_end = path.location();
        if curr_end == apple {
            // println!("Paths: {:#?}", priortized_paths);
            // println!("Found path with cost: {}", cost);
            return Some(path);
        }

        let neighbors = get_valid_neighbors(curr_end, level.board_size, board);
        for neighbor in neighbors {
            let mut new_path = path.clone();

            if new_path.has_not_taken_step(&neighbor) {
                let new_cost = new_path.location().euclidean_distance(apple) as i32;
                new_path.take_step(neighbor).unwrap();
                priortized_paths.push(Reverse(PathWithCost {
                    cost: new_cost,
                    path: new_path,
                }));
            }
        }
    }

    None
}

/// Get all valid neighbors of a position on the board.
///
/// Todo:
/// - Put this function in a future Board struct.
/// - Put these assertions in the type system.
fn get_valid_neighbors(player: &Position, board_size: u8, board: &Vec<Vec<char>>) -> Vec<Position> {
    // board level assertions should be in the type system
    assert!(
        board.len() == board_size as usize && board[0].len() == board_size as usize,
        "Board does not have the right shape"
    ); // There shouldn't be board level validation here.
    assert!(
        player.x < board_size && player.y < board_size,
        "Position out of bounds"
    );
    assert!(
        !("W".contains(board[player.y as usize][player.x as usize])),
        "Position cannot be a wall"
    );

    let mut neighbors = Vec::new();

    let directions = [
        (0, 1),  // Right
        (1, 0),  // Down
        (0, -1), // Left
        (-1, 0), // Up
    ];
    let invlid_chars = "WP";

    let Position { x: cx, y: cy } = *player;
    for (dy, dx) in directions.iter() {
        let ny = cy as i8 + dy;
        let nx = cx as i8 + dx;

        if nx >= 0
            && nx < board_size as i8
            && ny >= 0
            && ny < board_size as i8
            && !invlid_chars.contains(board[ny as usize][nx as usize])
        {
            let new_position = Position {
                x: nx as u8,
                y: ny as u8,
            };

            neighbors.push(new_position);
        }
    }

    neighbors
}

/// Convert a path of positions to a string of WASD commands.
///
/// Todo:
/// - Put this function in a future Path struct.
fn path_to_wasd(path: VecDeque<Position>) -> String {
    // Convert a path of positions to a string of WASD commands.
    let mut commands = String::new();

    for i in 0..path.len() - 1 {
        let curr = &path[i];
        let next = &path[i + 1];

        if next.x > curr.x {
            commands.push('D'); // Right
        } else if next.x < curr.x {
            commands.push('A'); // Left
        } else if next.y > curr.y {
            commands.push('S'); // Down
        } else if next.y < curr.y {
            commands.push('W'); // Up
        }
    }

    commands
}
