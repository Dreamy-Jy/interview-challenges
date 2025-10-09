mod bfs;
mod levels;

use levels::{Levels, get_levels, save_level_solutions};

///
///
/// Todo:
/// - considering making a REPL to interactively test the algorithms.
/// - Consider implmenting interfaces for this project: REPL, GUI, TUI???
///
fn main() {
    let _levels: Levels = get_levels();
    let bfs_solutions = bfs::generate_all_solutions(&_levels);
    save_level_solutions(bfs_solutions);
}
