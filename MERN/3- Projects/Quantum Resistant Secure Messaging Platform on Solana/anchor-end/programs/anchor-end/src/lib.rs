use anchor_lang::prelude::*;

declare_id!("2u85fbiyi6xmbtp5kCFqbEzuUygtLraqHTnP91E6BEXC");

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
