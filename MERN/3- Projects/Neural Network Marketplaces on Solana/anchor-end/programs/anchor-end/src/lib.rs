use anchor_lang::prelude::*;

declare_id!("CDwAc7BZZ9gpHBBTZZtNHV8e7aPod4bbqHMNUNropBKB");

#[program]
pub mod anchor_end {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
