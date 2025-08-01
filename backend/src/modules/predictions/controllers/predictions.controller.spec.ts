import { Test, TestingModule } from '@nestjs/testing';
import {
  EarlyWarningService,
  PredictionsService,
  PredictiveService,
  RiskCalculatorService,
} from '../services';
import { PredictionsController } from './predictions.controller';

describe('PredictionsController', () => {
  let controller: PredictionsController;
  let predictionsService: PredictionsService;

  const mockPredictionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    generatePredictions: jest.fn(),
    findByProject: jest.fn(),
  };

  const mockPredictiveService = {};
  const mockEarlyWarningService = {};
  const mockRiskCalculatorService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsController],
      providers: [
        {
          provide: PredictionsService,
          useValue: mockPredictionsService,
        },
        {
          provide: PredictiveService,
          useValue: mockPredictiveService,
        },
        {
          provide: EarlyWarningService,
          useValue: mockEarlyWarningService,
        },
        {
          provide: RiskCalculatorService,
          useValue: mockRiskCalculatorService,
        },
      ],
    }).compile();

    controller = module.get<PredictionsController>(PredictionsController);
    predictionsService = module.get<PredictionsService>(PredictionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Add tests for the actual controller methods:
  // - create, findAll, findOne, update, remove
  // - generatePredictions, findByProject
});
